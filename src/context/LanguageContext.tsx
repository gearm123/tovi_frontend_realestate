import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { persistLocaleChoice, readInitialLocale } from '../i18n/locale'
import { getDir, interpolate, translations, type TranslationTree } from '../i18n/translations'
import type { Locale, TranslationParams } from '../i18n/types'

type LanguageContextValue = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRtl: boolean
  setLocale: (locale: Locale) => void
  t: TranslationTree
  format: (template: string, params?: TranslationParams) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocaleChoice(next)
  }, [])

  const dir = getDir(locale)
  const isRtl = dir === 'rtl'

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir,
      isRtl,
      setLocale,
      t: translations[locale],
      format: interpolate,
    }),
    [locale, dir, isRtl, setLocale],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

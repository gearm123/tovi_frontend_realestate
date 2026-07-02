import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { business } from '../data/business'
import { getSiteContent } from '../data/content'

/**
 * Access centralized business details and localized site content.
 * Use this in pages/sections instead of hardcoding marketing copy.
 */
export function useSiteContent() {
  const { locale } = useLanguage()

  return useMemo(
    () => ({
      business,
      locale,
      content: getSiteContent(locale),
    }),
    [locale],
  )
}

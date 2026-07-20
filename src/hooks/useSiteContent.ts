import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from './useSiteData'
import { getSiteContent } from '../data/content'

/**
 * Access centralized business details and localized site content.
 * Use this in pages/sections instead of hardcoding marketing copy.
 */
export function useSiteContent() {
  const { locale } = useLanguage()
  const { business } = useSiteData()

  return useMemo(
    () => ({
      business,
      locale,
      content: getSiteContent(locale),
    }),
    [locale, business],
  )
}

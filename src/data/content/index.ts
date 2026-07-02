import type { Locale } from '../../i18n/types'
import type { LocalizedSiteContent, SiteContent } from '../../types/content'
import { siteContentEn } from './en'
import { siteContentHe } from './he'

export const siteContent: LocalizedSiteContent = {
  en: siteContentEn,
  he: siteContentHe,
}

/** Returns localized marketing/content copy for the active locale. */
export function getSiteContent(locale: Locale): SiteContent {
  return siteContent[locale]
}

export { siteContentEn, siteContentHe }

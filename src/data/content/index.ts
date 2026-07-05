import type { Locale } from '../../i18n/types'
import type { LocalizedSiteContent, SiteContent } from '../../types/content'
import { siteContentEn } from './en'
import { siteContentFr } from './fr'
import { siteContentHe } from './he'
import { siteContentRu } from './ru'

export const siteContent: LocalizedSiteContent = {
  en: siteContentEn,
  he: siteContentHe,
  fr: siteContentFr,
  ru: siteContentRu,
}

/** Returns localized marketing/content copy for the active locale. */
export function getSiteContent(locale: Locale): SiteContent {
  return siteContent[locale]
}

export { siteContentEn, siteContentHe }

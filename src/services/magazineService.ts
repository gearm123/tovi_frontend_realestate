import { getMagazineArticleBySlug, getMagazineArticles } from '../data/magazine'
import type { Locale } from '../i18n/types'

/**
 * Magazine data access — swap for CMS/API when ready.
 */
export { getMagazineArticles, getMagazineArticleBySlug }

export function getFeaturedMagazineArticles(locale: Locale, limit = 3) {
  return getMagazineArticles(locale).slice(0, limit)
}

import type { Locale } from '../i18n/types'
import { articleForLocale } from '../lib/magazineArticles'
import { getSiteData } from '../lib/siteDataStore'
import type { MagazineArticle } from '../types/magazine'

export function getMagazineArticles(locale: Locale): MagazineArticle[] {
  return getSiteData().articles.map((article) => articleForLocale(article, locale))
}

export function getMagazineArticleBySlug(
  slug: string,
  locale: Locale,
): MagazineArticle | undefined {
  return getMagazineArticles(locale).find((article) => article.slug === slug)
}

export function getFeaturedMagazineArticles(locale: Locale, limit = 3) {
  return getMagazineArticles(locale).slice(0, limit)
}

import type { Locale } from '../../i18n/types'
import type { MagazineArticle } from '../../types/magazine'
import { magazineArticlesEn } from './en'
import { magazineArticlesHe } from './he'

const articlesByLocale: Record<Locale, MagazineArticle[]> = {
  en: magazineArticlesEn,
  he: magazineArticlesHe,
}

export function getMagazineArticles(locale: Locale): MagazineArticle[] {
  return articlesByLocale[locale]
}

export function getMagazineArticleBySlug(
  slug: string,
  locale: Locale,
): MagazineArticle | undefined {
  return articlesByLocale[locale].find((article) => article.slug === slug)
}

export { magazineArticlesEn, magazineArticlesHe }

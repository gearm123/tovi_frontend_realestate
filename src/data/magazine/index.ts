import type { Locale } from '../../i18n/types'
import type { MagazineArticle } from '../../types/magazine'
import { magazineArticlesEn } from './en'
import { magazineArticlesFr } from './fr'
import { magazineArticlesHe } from './he'
import { magazineArticlesRu } from './ru'

const articlesByLocale: Record<Locale, MagazineArticle[]> = {
  en: magazineArticlesEn,
  he: magazineArticlesHe,
  fr: magazineArticlesFr,
  ru: magazineArticlesRu,
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

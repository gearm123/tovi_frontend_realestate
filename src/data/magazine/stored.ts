import type { Locale } from '../../i18n/types'
import type { MagazineArticle, MagazineLocaleCopy } from '../../types/magazine'
import { magazineArticlesEn } from './en'
import { magazineArticlesFr } from './fr'
import { magazineArticlesHe } from './he'
import { magazineArticlesRu } from './ru'

const byLocale: Record<Locale, MagazineArticle[]> = {
  en: magazineArticlesEn,
  he: magazineArticlesHe,
  fr: magazineArticlesFr,
  ru: magazineArticlesRu,
}

function localeCopy(article: MagazineArticle): MagazineLocaleCopy {
  return {
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    body: article.body,
    source: article.source,
  }
}

/** English articles with the existing Hebrew, French, and Russian text attached. */
export function buildStoredMagazineArticles(): MagazineArticle[] {
  return magazineArticlesEn.map((article) => {
    const translations = {} as Partial<Record<Locale, MagazineLocaleCopy>>
    for (const locale of Object.keys(byLocale) as Locale[]) {
      const match = byLocale[locale].find((item) => item.id === article.id)
      if (match) translations[locale] = localeCopy(match)
    }
    return { ...article, translations }
  })
}

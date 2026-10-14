import type { Locale } from '../i18n/types'
import type { MagazineArticle, MagazineArticleType, MagazineLocaleCopy } from '../types/magazine'

function overlayCopy(
  manual: MagazineLocaleCopy | undefined,
  automatic: MagazineLocaleCopy | undefined,
): MagazineLocaleCopy | undefined {
  if (!manual) return automatic
  if (!automatic) return manual
  return {
    category: manual.category || automatic.category,
    title: manual.title || automatic.title,
    excerpt: manual.excerpt || automatic.excerpt,
    date: manual.date || automatic.date,
    body: manual.body.length ? manual.body : automatic.body,
    source: manual.source ?? automatic.source,
  }
}

export function articleForLocale(article: MagazineArticle, locale: Locale): MagazineArticle {
  if (locale === 'en') return article
  const copy = locale === 'he'
    ? overlayCopy(article.hebrew, article.translations?.he)
    : article.translations?.[locale]
  if (!copy) return article
  return {
    ...article,
    category: copy.category || article.category,
    title: copy.title || article.title,
    excerpt: copy.excerpt || article.excerpt,
    date: copy.date || article.date,
    body: copy.body.length ? copy.body : article.body,
    source: copy.source ?? article.source,
  }
}

export function paragraphsToText(body: string[]): string {
  return body.join('\n\n')
}

export function textToParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function articleSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function createBlankArticle(): MagazineArticle {
  return {
    id: `mag-${Date.now()}`,
    slug: '',
    type: 'article',
    category: '',
    title: '',
    date: '',
    excerpt: '',
    image: '',
    videoUrl: '',
    body: [],
    isPlaceholder: false,
  }
}

export function isArticleType(value: string): value is MagazineArticleType {
  return value === 'article' || value === 'video'
}

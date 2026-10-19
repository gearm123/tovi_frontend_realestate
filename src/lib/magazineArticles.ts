import type { Locale } from '../i18n/types'
import type {
  MagazineArticle,
  MagazineArticleType,
  MagazineGalleryImage,
  MagazineLocaleCopy,
} from '../types/magazine'
import { applyMamadTerms, applyMamadTermsAcross } from '../utils/mamadTerms'

function hasWrittenHebrew(copy: MagazineLocaleCopy | undefined): boolean {
  return Boolean(copy && (copy.title || copy.excerpt || copy.body.length))
}

function withMamadTerms(article: MagazineArticle, locale: Locale): MagazineArticle {
  const body = article.body ?? []
  const [title, excerpt, ...nextBody] = applyMamadTermsAcross(
    [article.title, article.excerpt, ...body],
    locale,
  )
  return { ...article, title, excerpt, body: nextBody }
}

export function articleForLocale(article: MagazineArticle, locale: Locale): MagazineArticle {
  if (locale === 'en') return withMamadTerms(article, locale)
  if (locale === 'he' && hasWrittenHebrew(article.hebrew)) {
    const manual = article.hebrew as MagazineLocaleCopy
    const automatic = article.translations?.he
    return withMamadTerms(
      {
        ...article,
        category: manual.category || automatic?.category || article.category,
        title: manual.title || automatic?.title || article.title,
        excerpt: manual.excerpt || automatic?.excerpt || article.excerpt,
        date: manual.date || automatic?.date || article.date,
        body: manual.body.length ? manual.body : automatic?.body?.length ? automatic.body : article.body,
        source: manual.source ?? automatic?.source ?? article.source,
      },
      locale,
    )
  }
  const copy = article.translations?.[locale]
  if (!copy) return withMamadTerms(article, locale)
  return withMamadTerms(
    {
      ...article,
      category: copy.category || article.category,
      title: copy.title || article.title,
      excerpt: copy.excerpt || article.excerpt,
      date: copy.date || article.date,
      body: copy.body.length ? copy.body : article.body,
      source: copy.source ?? article.source,
    },
    locale,
  )
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

export function galleryFromArticle(article: MagazineArticle | undefined): MagazineGalleryImage[] {
  const images = (article?.images ?? [])
    .map((image) => ({
      src: image.src.trim(),
      caption: (image.caption ?? '').trim(),
      hebrewCaption: (image.hebrewCaption ?? '').trim(),
      credit: (image.credit ?? '').trim(),
    }))
    .filter((image) => image.src)
  if (images.length) return images
  const cover = article?.image.trim() ?? ''
  return cover ? [{ src: cover, caption: '', hebrewCaption: '', credit: '' }] : []
}

export function captionForImage(
  article: MagazineArticle,
  image: MagazineGalleryImage,
  index: number,
  locale: Locale,
): string {
  if (locale === 'he' && image.hebrewCaption) return applyMamadTerms(image.hebrewCaption, locale)
  if (locale !== 'en') {
    const translated = article.translations?.[locale]?.captions?.[index]?.trim()
    if (translated) return applyMamadTerms(translated, locale)
  }
  return applyMamadTerms(image.caption, locale)
}

/** Project guides use the Buildings category. The contact note is added for that category only. */
export function isProjectArticle(article: { category?: string } | undefined): boolean {
  return article?.category?.trim().toLowerCase() === 'buildings'
}

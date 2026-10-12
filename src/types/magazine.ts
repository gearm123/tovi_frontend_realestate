import type { Locale } from '../i18n/types'

/** Written article or video feature */
export type MagazineArticleType = 'article' | 'video'

export interface MagazineSource {
  name: string
  url: string
  credit: string
}

/** Translated article text. English on the article itself is the copy the office edits. */
export interface MagazineLocaleCopy {
  category: string
  title: string
  excerpt: string
  date: string
  body: string[]
  source?: MagazineSource
}

export interface MagazineArticle {
  id: string
  slug: string
  type: MagazineArticleType
  category: string
  title: string
  date: string
  excerpt: string
  image: string
  /** YouTube/Vimeo URL or direct .mp4 — optional for written articles */
  videoUrl?: string
  /** Full article body for detail page */
  body: string[]
  /** When true, UI may show a sample marker */
  isPlaceholder: boolean
  /** Original publication credit, e.g. TheMarker */
  source?: MagazineSource
  /** Site-language copies. The public site uses these for Hebrew, French, and Russian. */
  translations?: Partial<Record<Locale, MagazineLocaleCopy>>
}

export interface MagazinePageContent {
  accent?: string
  title: string
  subtitle?: string
  readMore: string
  watchVideo: string
  videoLabel: string
  backToMagazine: string
  articleNotFound: string
  placeholderLabel: string
  cta: {
    title: string
    description: string
    buttonLabel: string
    href: string
  }
}

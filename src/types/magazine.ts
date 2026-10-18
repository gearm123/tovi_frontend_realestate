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
  /** Captions aligned with the article photos. A blank caption keeps the English one. */
  captions?: string[]
}

/** One photo in an article. The Hebrew caption is published as written. */
export interface MagazineGalleryImage {
  src: string
  caption: string
  hebrewCaption: string
  /** Photographer or source line. Published as written in every language. */
  credit?: string
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
  /** Photos shown on the article. The first photo is the cover. */
  images?: MagazineGalleryImage[]
  /** YouTube/Vimeo URL or direct .mp4 — optional for written articles */
  videoUrl?: string
  /** Full article body for detail page */
  body: string[]
  /** When true, UI may show a sample marker */
  isPlaceholder: boolean
  /** Original publication credit, e.g. TheMarker */
  source?: MagazineSource
  /**
   * Hebrew written in the admin panel.
   * The Hebrew site uses this as entered, and saving never replaces it with an automatic translation.
   */
  hebrew?: MagazineLocaleCopy
  /** Automatic site-language copies. Hebrew here is used only when `hebrew` is empty. */
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

/** Written article or video feature */
export type MagazineArticleType = 'article' | 'video'

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

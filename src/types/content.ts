import type { Locale } from '../i18n/types'

/** Reusable page section with title and body paragraphs */
export interface ContentSection {
  accent?: string
  title: string
  subtitle?: string
  paragraphs: string[]
}

/** About content — used on homepage and /about page */
export interface AboutContent extends ContentSection {
  /** Trust highlights for homepage (experience, service, expertise) */
  highlights: string[]
  ctaLabel: string
  ctaHref?: string
}

export interface ReviewItem {
  id: string
  /** Display name — use generic labels until real client approval */
  author: string
  quote: string
  rating: number
  date: string
  /** e.g. Buyer, Seller — optional context */
  role?: string
  /** When true, UI shows a sample/placeholder marker */
  isPlaceholder: boolean
}

export interface GoogleReviewsPlaceholder {
  /** Set false to hide until a live Google Business link is ready */
  showButton: boolean
  url: string
  buttonLabel: string
  note: string
}

export interface ReviewsSection {
  accent?: string
  title: string
  subtitle?: string
  /** Label shown on placeholder testimonials */
  placeholderLabel: string
  items: ReviewItem[]
  googleReviews: GoogleReviewsPlaceholder
}

/** Service or package block with bullet points */
export interface ServiceSection extends ContentSection {
  bullets: string[]
  /** Contact CTA label — e.g. "Speak with ProperTLV" */
  ctaLabel: string
  /** Optional contact link; defaults to /contact */
  ctaHref?: string
}

export interface ServicesPageContent extends ContentSection {
  /** Short line shown on homepage services overview */
  overviewIntro: string
  /** Homepage link to full services page */
  viewAllLink: string
}
export interface CtaSection {
  title: string
  description: string
  buttonLabel: string
  /** Optional helper text below the form or button */
  footnote?: string
}

export interface SiteContent {
  about: AboutContent
  servicesPage: ServicesPageContent
  exclusivityPackage: ServiceSection
  buyerServices: ServiceSection
  sellerServices: ServiceSection
  reviews: ReviewsSection
  newsletter: CtaSection
  booking: CtaSection
}

export type LocalizedSiteContent = Record<Locale, SiteContent>

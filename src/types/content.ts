import type { Locale } from '../i18n/types'
import type { MagazinePageContent } from './magazine'

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

export interface PackageImage {
  src: string
  alt: string
}

/** Service or package block with bullet points */
export interface ServiceSectionGroup {
  title: string
  items: string[]
  image?: string
  imageAlt?: string
  /** Optional secondary image — e.g. brochure mockup beside a lifestyle photo */
  secondaryImage?: string
  secondaryImageAlt?: string
}

/** Service or package block with bullet points */
export interface ServiceSection extends ContentSection {
  bullets: string[]
  /** Optional grouped sections — used for multi-part packages such as the sales brochure */
  groups?: ServiceSectionGroup[]
  /** Intro hero image — used on the sales package page */
  heroImage?: string
  heroImageAlt?: string
  /** Short intro highlights — e.g. “Why choose exclusivity with us?” */
  highlights?: string[]
  highlightsTitle?: string
  /** Portfolio / marketing showcase grid from the sales brochure */
  showcaseImages?: PackageImage[]
  /** Contact CTA label — e.g. "Speak with ProperTLV" */
  ctaLabel: string
  /** Optional contact link; defaults to /contact */
  ctaHref?: string
}

export interface SalesPackageClosingContent {
  title: string
  subtitle?: string
  ctaLabel: string
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

export interface NewsletterSection extends CtaSection {
  accent?: string
  nameLabel: string
  emailLabel: string
  successMessage: string
  errorMessage: string
}

export interface BookingSection extends CtaSection {
  accent?: string
  /** Shown when booking URL is still a placeholder */
  placeholderNote?: string
}

export interface MapSectionContent {
  accent?: string
  title: string
  subtitle?: string
  placeholderNote: string
  viewProperty: string
  allNeighborhoods: string
  listingsCount: string
  saleLabel: string
  rentalLabel: string
  neighborhoodFallback: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  image: string
  imageAlt: string
}

export interface TeamSectionContent {
  accent?: string
  title: string
  subtitle?: string
  members: TeamMember[]
}

export interface SiteContent {
  about: AboutContent
  servicesPage: ServicesPageContent
  exclusivityPackage: ServiceSection
  salesPackageClosing: SalesPackageClosingContent
  salesTeam: TeamSectionContent
  buyerServices: ServiceSection
  sellerServices: ServiceSection
  reviews: ReviewsSection
  magazinePage: MagazinePageContent
  newsletter: NewsletterSection
  booking: BookingSection
  mapSection: MapSectionContent
}

export type LocalizedSiteContent = Record<Locale, SiteContent>

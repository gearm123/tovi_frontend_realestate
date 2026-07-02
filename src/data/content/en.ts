import type { SiteContent } from '../../types/content'
import { PLACEHOLDER_GOOGLE_REVIEWS_URL } from '../placeholders'

/**
 * PLACEHOLDER_COPY — English site content.
 * Service sections marked below: replace with client-approved wording in en.ts / he.ts.
 */
export const siteContentEn: SiteContent = {
  // PLACEHOLDER_COPY: About ProperTLV
  about: {
    accent: 'Our Story',
    title: 'About ProperTLV',
    subtitle: 'Boutique real estate guidance rooted in Tel Aviv.',
    paragraphs: [
      'ProperTLV is led by Lee Cohen — a focused, local service for buyers and sellers who want clear advice and personal attention, not a call centre experience.',
      'With deep familiarity across Tel Aviv’s neighbourhoods, we help you understand where to look, what to compare, and how to move forward with confidence. Every conversation starts with listening.',
      'Whether you are buying your first apartment, selling a family home, or renting near the sea, ProperTLV offers discreet support tailored to your pace and priorities.',
    ],
    highlights: [
      'Personal, one-to-one service throughout your search or sale',
      'Tel Aviv neighbourhood expertise — from Rothschild to Ramat Aviv',
      'Straightforward guidance on pricing, viewings, and next steps',
      'Discreet, professional handling for local and international clients',
    ],
    ctaLabel: 'Read more about ProperTLV',
    ctaHref: '/about',
  },

  servicesPage: {
    accent: 'How We Work',
    title: 'Our Services',
    subtitle: 'Thoughtful, hands-on real estate guidance across Tel Aviv.',
    overviewIntro:
      'Whether you are selling, buying, or exploring a premium listing package — ProperTLV offers focused, personal support at every stage.',
    viewAllLink: 'View all services',
    paragraphs: [],
  },

  // PLACEHOLDER_COPY: Exclusivity Package — premium seller offering
  exclusivityPackage: {
    accent: 'Exclusive',
    title: 'Exclusivity Package',
    subtitle: 'A focused, premium service for sellers who want careful handling from start to finish.',
    paragraphs: [
      'The Exclusivity Package is ProperTLV’s dedicated selling service for homeowners who prefer a discreet, well-managed sale. Rather than a high-volume approach, the focus is on presenting your property clearly, reaching the right audience, and guiding the process with steady communication.',
      'Lee Cohen works with you directly — from preparing the listing through viewings, offers, and coordination with the professionals involved in the sale. The scope below reflects our standard premium package; final details are agreed with each client.',
    ],
    bullets: [
      'Property positioning and pricing guidance tailored to your home',
      'Professional photography and optional video for the listing',
      'Carefully written marketing across selected channels',
      'Managed viewings and screening of interested buyers',
      'Personal support through negotiation and closing steps',
    ],
    ctaLabel: 'Contact ProperTLV about the package',
    ctaHref: '/contact?interest=selling',
  },

  // PLACEHOLDER_COPY: Buyer services
  buyerServices: {
    accent: 'For Buyers',
    title: 'Services for Buyers',
    subtitle: 'Finding a Tel Aviv home that fits — with guidance, not pressure.',
    paragraphs: [
      'Buying in Tel Aviv can feel overwhelming: fast-moving listings, varied neighbourhoods, and many details to compare. ProperTLV helps you move through the search with a clear plan — understanding what matters to you, then focusing on properties that genuinely match.',
      'You receive honest context on areas and pricing, curated options worth your time, and direct support through viewings, offers, and the steps that follow. The aim is a smooth process and a home that feels right for the long term.',
    ],
    bullets: [
      'Initial conversation to understand your needs, budget, and priorities',
      'Neighbourhood guidance based on how you want to live in the city',
      'Curated shortlists and arranged viewings',
      'Market context to support informed decisions',
      'Negotiation support and coordination with lawyers and advisors',
    ],
    ctaLabel: 'Speak with ProperTLV about buying',
    ctaHref: '/contact?interest=buying',
  },

  // PLACEHOLDER_COPY: Seller services
  sellerServices: {
    accent: 'For Sellers',
    title: 'Services for Sellers',
    subtitle: 'Present your property well — and reach buyers who are serious about Tel Aviv.',
    paragraphs: [
      'Selling a home is about more than posting an ad. ProperTLV helps you position your property accurately, present it at its best, and connect with buyers who are a genuine fit.',
      'From first valuation conversation through marketing, viewings, and offer review, you have a single point of contact who keeps the process organised and transparent.',
    ],
    bullets: [
      'Pricing and positioning advice grounded in the local market',
      'Staging guidance, photography, and listing preparation',
      'Targeted marketing to reach relevant buyers',
      'Viewing management and follow-up with interested parties',
      'Offer review, negotiation support, and closing coordination',
    ],
    ctaLabel: 'Contact ProperTLV about selling',
    ctaHref: '/contact?interest=selling',
  },

  // PLACEHOLDER_COPY: Sample testimonials — replace with approved client quotes
  reviews: {
    accent: 'Testimonials',
    title: 'What Clients Say',
    subtitle: 'Sample testimonials for layout preview. Replace with real client feedback when available.',
    placeholderLabel: 'Sample',
    items: [
      {
        id: 'review-1',
        author: 'Sample client — Buyer',
        role: 'Buyer',
        quote:
          'Lee guided us through every step of buying in Tel Aviv. Patient, knowledgeable, and always available — we felt supported from the first call to the signing.',
        rating: 5,
        date: 'Placeholder',
        isPlaceholder: true,
      },
      {
        id: 'review-2',
        author: 'Sample client — Seller',
        role: 'Seller',
        quote:
          'Our apartment was presented beautifully and the sale process felt organised and transparent throughout.',
        rating: 5,
        date: 'Placeholder',
        isPlaceholder: true,
      },
      {
        id: 'review-3',
        author: 'Sample client — Buyer',
        role: 'Buyer',
        quote:
          'As newcomers to the city, we needed someone who understood neighbourhoods beyond the listings. ProperTLV helped us focus on what mattered.',
        rating: 5,
        date: 'Placeholder',
        isPlaceholder: true,
      },
      {
        id: 'review-4',
        author: 'Sample client — Seller',
        role: 'Seller',
        quote:
          'Professional, responsive, and calm under pressure — exactly what we needed when selling our family home.',
        rating: 5,
        date: 'Placeholder',
        isPlaceholder: true,
      },
    ],
    googleReviews: {
      showButton: true,
      url: PLACEHOLDER_GOOGLE_REVIEWS_URL,
      buttonLabel: 'View Google Reviews',
      note: 'Google Business profile link — to be connected when live.',
    },
  },

  newsletter: {
    title: 'Stay in the Loop',
    description:
      'Tel Aviv market updates and new listings from ProperTLV. Mailing list integration to be connected when ready.',
    buttonLabel: 'Subscribe',
    footnote: 'We respect your privacy. Unsubscribe anytime.',
  },

  booking: {
    title: 'Book a Viewing or Consultation',
    description:
      'Ready to see a property or talk through your search? Get in touch with Lee Cohen to arrange a call or viewing.',
    buttonLabel: 'Book now',
    footnote: 'You can also reach us by phone or WhatsApp.',
  },
}

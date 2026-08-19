import type { SiteContent } from '../../types/content'
import { business } from '../business'

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
      'ProperTLV is led by Tovi — a focused, local service for buyers and sellers who want clear advice and personal attention, not a call centre experience.',
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
    subtitle: 'Personal guidance for buyers and sellers across Tel Aviv.',
    overviewIntro:
      'From finding the right home to selling with clarity — ProperTLV offers hands-on buyer and seller support, plus a dedicated Exclusive Representation Package for premium listings.',
    viewAllLink: 'View all services',
    paragraphs: [
      'ProperTLV is a boutique Tel Aviv agency. On this page you’ll find how we help buyers search with confidence and how we guide sellers through pricing, marketing, and closing. For our full premium sales program — photography, staging, network exposure, and 4-month exclusive representation — see the Exclusive Package page.',
    ],
    exclusivePackageTeaser: {
      body: 'A structured 4-month exclusive program for sellers who want the full ProperTLV treatment: premium marketing, elite buyer-network exposure, personal senior-agent service, and negotiation to maximize value.',
      ctaLabel: 'Explore the Exclusive Package',
      ctaHref: '/sellers-package',
    },
  },

  exclusivityPackage: {
    accent: 'Exclusive',
    title: 'The Exclusive Representation Package',
    subtitle: 'Exclusivity that delivers results with ProperTLV.',
    packageDuration: '4-month exclusive representation',
    durationImage: '/assets/exclusivity-he/package-duration.jpg',
    durationImageAlt: 'Luxury poolside setting — ProperTLV four-month exclusive representation',
    heroImage: '/assets/sales-package/hero-tel-aviv.jpg',
    heroImageAlt: 'Tel Aviv skyline at golden hour — ProperTLV exclusive sales marketing',
    paragraphs: [
      'At ProperTLV, we’re not just agents — we’re trusted partners in Tel Aviv’s high-end real estate market. With 17+ years of experience and a global clientele including expats, diplomats, and locals, we handle every detail with care and precision.',
      'From Bauhaus gems to garden and rooftop homes, our exclusive listings shine through targeted marketing, 24/7 service, and full legal support.',
      'Your property deserves representation at the highest level.',
    ],
    highlights: [
      'Strategic marketing for qualified buyers',
      'Smooth and professional end-to-end management',
      'Complete peace of mind',
    ],
    highlightsTitle: 'Why choose exclusivity with us?',
    bullets: [],
    groups: [
      {
        title: '1. Premium Marketing Package',
        image: '/assets/sales-package/premium-marketing.jpg',
        imageAlt: 'Professionally staged living room prepared for a ProperTLV listing',
        items: [
          'Professional photography and videography — includes cinematic video tours and aerial drone footage (if relevant)',
          'Interior design consultation and home styling — our in-house design team ensures the home looks its absolute best',
          'Custom-designed digital brochure — luxury-grade marketing materials with multilingual options (Hebrew, English, French, and Russian)',
        ],
      },
      {
        title: '2. Elite Exposure & Network',
        items: [
          '17+ years of high-end real estate expertise — deep roots in the local market and international buyer community',
          'Exclusive access to our client network — mailing list of over 5,000 qualified buyers, many of whom are overseas investors or relocating families',
          'Instagram: 23K+ active, high-end followers',
          'Facebook: 2.1K+ curated audience and posting in exclusive realtor groups',
          'Regular content shared for your property via reels, posts, and stories with strong engagement',
          'LinkedIn page: 1,200 close connections',
          'Listing on premium portals — Yad2, Madlan, OnMap, Google Ads, our website, and international portals where applicable',
        ],
      },
      {
        title: '3. Personalized Promotion Strategy',
        image: '/assets/sales-package/promotion-strategy.jpg',
        imageAlt: 'ProperTLV agent hosting a private property tour for qualified buyers',
        items: [
          'Dedicated marketing plan for your property — tailored to your home’s unique features and target buyer profile',
          'WhatsApp and direct messaging campaigns — property sent directly to our personal contact list (VIP buyers, ambassadors, relocation agencies, and industry colleagues)',
          'Open houses and private tours — organized for qualified buyers only, with guided tours by a senior agent',
        ],
      },
      {
        title: '4. Personal Premium Service',
        items: [
          'Single point of contact — full accountability and availability; one agent handling everything, with no confusion',
          'Clear communication and updates — monthly performance reports and feedback from potential buyers',
          'Discreet sales option — for clients who prefer not to advertise publicly (quiet or off-market listings)',
        ],
      },
      {
        title: '5. Achieving Maximum Value for Your Property',
        image: '/assets/sales-package/maximize-sale-1.jpg',
        imageAlt: 'Luxury Tel Aviv apartment interior marketed by ProperTLV',
        items: [
          'Strategic pricing advisory — based on real-time data and luxury market trends',
          'Offer and negotiation management — we manage every step to secure the highest possible sale price',
          'Experience with high-value transactions — proven results in properties worth millions of shekels and euros',
        ],
      },
    ],
    ctaLabel: 'Speak with ProperTLV about the package',
    ctaHref: '/contact?interest=selling',
    relatedLink: {
      label: 'Read our 2026 Tel Aviv market outlook',
      href: '/magazine/tel-aviv-real-estate-window-2026',
    },
  },

  salesPackageClosing: {
    title: 'We look forward to accompanying you to your next deal',
    subtitle: 'Reach out to start your exclusive sales journey with ProperTLV.',
    ctaLabel: 'Contact ProperTLV',
  },

  salesTeam: {
    accent: 'The Team',
    title: 'The Team',
    subtitle: 'The people behind ProperTLV’s exclusive sales experience.',
    footnote:
      'Keeping every listing coordinated from first call to closing.',
    members: [
      {
        id: 'tova-dekkers',
        name: 'Tova Dekkers',
        title: 'Founder & Lead Real Estate Agent',
        bio: 'With over 17 years of experience, Tova offers quality, professional service and personal support tailored to each client’s needs and budget. Her vast network spans embassies, businesses, and buyers both in Israel and abroad. Known for her sharp eye for detail and ability to close deals, she guides clients through every step of the process with precision and care.',
        image: '/assets/team/tova-dekkers.jpg',
        imageAlt: 'Portrait of Tova Dekkers, Founder and Lead Real Estate Agent at ProperTLV',
      },
      {
        id: 'miri-minkin',
        name: 'Miri Minkin',
        title: 'Real Estate Specialist',
        bio: 'With over 10 years of experience in construction and real estate, Miri brings deep knowledge and professionalism to every transaction. She specializes in sales and rentals across Tel Aviv and surrounding areas, offering reliable, personal, and high-quality service throughout the process. Miri guides with care, transparency, integrity, and attention to every detail.',
        image: '/assets/team/miri-minkin.jpg',
        imageAlt: 'Portrait of Miri Minkin, Real Estate Specialist at ProperTLV',
      },
      {
        id: 'yana-yatsenko',
        name: 'Yana Yatsenko',
        title: 'Rental Specialist',
        bio: 'Yana specializes in Tel Aviv rentals, guiding tenants and landlords through leases, viewings, and the details that keep every rental move running smoothly. She brings clear communication and practical support from first inquiry to handover.',
        image: '/assets/team/yana-Yatsenko.png',
        imageAlt: 'Portrait of Yana Yatsenko, Rental Specialist at ProperTLV',
      },
      {
        id: 'eden-nahum',
        name: 'Eden Nahum',
        title: 'Real Estate Agent',
        bio: 'Eden supports buyers and sellers across Tel Aviv with attentive, hands-on service. She helps clients navigate viewings, negotiations, and the steps that turn a listing into a successful deal.',
        image: '/assets/team/eden-nahum.png',
        imageAlt: 'Portrait of Eden Nahum, Real Estate Agent at ProperTLV',
      },
      {
        id: 'lee-cohen',
        name: 'Lee Cohen',
        title: 'Office & Operations',
        bio: 'Lee keeps ProperTLV’s day-to-day operations running seamlessly — coordinating listings, appointments, and office communication so every client experience stays organized from first call to closing.',
        image: '/assets/team/lee-cohen.png',
        imageAlt: 'Portrait of Lee Cohen, Office & Operations at ProperTLV',
      },
    ],
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
    relatedLinks: [
      {
        label: 'Tel Aviv Real Estate 2026: The Opportunity for Israeli Buyers',
        href: '/magazine/tel-aviv-real-estate-israeli-buyers-2026',
      },
      {
        label: 'Tel Aviv Real Estate: The Window of Opportunity in 2026',
        href: '/magazine/tel-aviv-real-estate-window-2026',
      },
    ],
  },

  sellerServices: {
    accent: 'For Sellers',
    title: 'Services for Sellers',
    subtitle: 'Clear advice and organised support — from valuation through closing.',
    paragraphs: [
      'Selling in Tel Aviv means balancing price, timing, presentation, and the right audience. ProperTLV helps you understand where your property sits in the market, prepare it thoughtfully, and move through viewings and offers without losing control of the process.',
      'This is our standard seller support: strategic guidance, coordinated communication, and professional handling at every step. If you want the full premium program — professional media, staging, targeted campaigns, and exclusive representation — that is covered in our separate Exclusive Representation Package.',
    ],
    bullets: [
      'Initial valuation conversation and pricing context for your neighbourhood',
      'Advice on presentation and readiness before going to market',
      'Listing coordination and organised viewing schedules',
      'Buyer feedback, offer review, and negotiation support',
      'Discreet handling when privacy matters',
      'Coordination with lawyers and advisors through closing',
    ],
    ctaLabel: 'Contact ProperTLV about selling',
    ctaHref: '/contact?interest=selling',
    relatedLink: {
      label: 'See the Exclusive Representation Package',
      href: '/sellers-package',
    },
  },

  reviews: {
    accent: "Client's Words",
    title: 'What our clients say',
    subtitle: 'Feedback from buyers, sellers, and renters who worked with ProperTLV.',
    placeholderLabel: 'Sample',
    items: [
      {
        id: 'review-arman',
        author: 'Arman Arkopian',
        quote:
          'Working with ProperTLV was a smooth and pleasant experience. Tovi Dekkers was professional, friendly, easy to communicate with, and always willing to help with questions along the way. She provided solid guidance and made the process feel manageable. I’d definitely recommend this agency to anyone looking for reliable real estate support in Tel Aviv.',
        rating: 5,
        date: '',
        isPlaceholder: false,
      },
      {
        id: 'review-dorian',
        author: 'Dorian Schimmel',
        quote:
          'Tovi has found me three apartments over the years, always professional, friendly, and very helpful. I recommend her service highly.',
        rating: 5,
        date: '',
        isPlaceholder: false,
      },
      {
        id: 'review-inna',
        author: 'Inna Dulerayn',
        quote:
          'I am feeling really grateful to the team of ProperTLV, especially to our agent Tova Dekkers for finding us the excellent place to rent. She is very knowledgeable and flexible — we felt very supported and safe dealing with her and making decisions. She has found for us the perfect property, and helped to find the best solutions in discussing all the details. I would definitely recommend her to my friends.',
        rating: 5,
        date: '',
        role: 'Renter',
        isPlaceholder: false,
      },
      {
        id: 'review-lee',
        author: 'Lee',
        quote: 'Fantastic service. Friendly and helpful even for people who don’t speak Hebrew!',
        rating: 5,
        date: '',
        isPlaceholder: false,
      },
      {
        id: 'review-inbal',
        author: 'Inbal Cohen-Franke',
        quote:
          'Tovi and her team are extremely nice and professional. I have used their services more than once and was always very pleased. I recommended them to all of my friends who are selling, buying, or renting real estate in Tel Aviv, and everyone was always very pleased. Highly recommended!',
        rating: 5,
        date: '',
        isPlaceholder: false,
      },
      {
        id: 'review-sivan',
        author: 'Sivan Hadari',
        quote:
          'ProperTLV is most likely the best real estate agency in Tel Aviv. From the moment I contacted them until I signed the lease to my new apartment, they were extremely professional, helpful, and kind. After I made the move to Tel Aviv it was very challenging to find a reasonably priced and beautiful apartment that fit all my needs, but Tovi and the team guided me until I found my dream place. Highly recommended!',
        rating: 5,
        date: '',
        role: 'Renter',
        isPlaceholder: false,
      },
    ],
    googleReviews: {
      showButton: true,
      url: business.googleBusiness.mapsUrl,
      buttonLabel: 'View all reviews',
      sourceLabel: 'Google Reviews',
      reviewCountLabel: 'reviews',
      ariaLabel: 'View Proper TLV on Google Maps — 5.0 stars from 38 reviews',
    },
  },

  // PLACEHOLDER_COPY: Magazine page chrome and CTA
  magazinePage: {
    accent: 'Stories',
    title: 'ProperTLV Magazine',
    subtitle: "Stories, guides, and insights from Tel Aviv's property scene.",
    readMore: 'Read article',
    watchVideo: 'Watch video',
    videoLabel: 'Video',
    backToMagazine: 'Back to magazine',
    articleNotFound: 'Article not found',
    placeholderLabel: 'Sample',
    cta: {
      title: 'Thinking about buying or selling in Tel Aviv?',
      description:
        'Speak with Tovi for personal guidance on properties, neighbourhoods, and next steps.',
      buttonLabel: 'Contact ProperTLV',
      href: '/contact',
    },
  },

  newsletter: {
    accent: 'Early Access',
    title: 'Get new properties before everyone else',
    description:
      'Join ProperTLV’s list for fresh listings, neighbourhood notes, and market updates — delivered discreetly to your inbox.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    buttonLabel: 'Subscribe',
    footnote: 'We respect your privacy. Unsubscribe anytime.',
    successMessage:
      'Thank you — you’re on the list. We’ll be in touch when new properties match what you’re looking for.',
    errorMessage: 'Something went wrong. Please try again.',
  },

  booking: {
    accent: 'Schedule',
    title: 'Book a viewing or consultation',
    description:
      'Ready to see a property or talk through your search? Pick a time that suits you for a call or viewing with Tovi.',
    buttonLabel: 'Schedule a visit',
    footnote: 'You can also reach us by phone or WhatsApp.',
    placeholderNote: 'Online scheduling link coming soon — use Contact to book a visit.',
  },

  mapSection: {
    accent: 'Tel Aviv',
    title: 'Properties across the city',
    subtitle:
      'Explore ProperTLV listings by neighbourhood — select a pin or listing to view details.',
    placeholderNote:
      'Preview map — connect Google Maps when API credentials are ready.',
    viewProperty: 'View property',
    allNeighborhoods: 'All neighbourhoods',
    listingsCount: '{count} listings',
    saleLabel: 'For sale',
    rentalLabel: 'For rent',
    neighborhoodFallback: 'Approximate neighbourhood pin',
  },
}

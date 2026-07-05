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
    subtitle: 'Exclusive representation and premium marketing for Tel Aviv sellers.',
    overviewIntro:
      'From the Exclusive Representation Package to buyer and seller guidance — ProperTLV offers hands-on support backed by 15+ years in Tel Aviv’s high-end market.',
    viewAllLink: 'View all services',
    paragraphs: [],
  },

  exclusivityPackage: {
    accent: 'Exclusive',
    title: 'The Exclusive Representation Package',
    subtitle: 'The power of selling exclusively with ProperTLV.',
    heroImage: '/assets/sales-package/hero-tel-aviv.jpg',
    heroImageAlt: 'Tel Aviv skyline at golden hour — ProperTLV exclusive sales marketing',
    paragraphs: [
      'At ProperTLV, we’re not just agents — we’re trusted partners in Tel Aviv’s high-end real estate market. With 15+ years of experience and a global clientele including expats, diplomats, and locals, we handle every detail with care and precision.',
      'From Bauhaus gems to garden and rooftop homes, our exclusive listings shine through targeted marketing, 24/7 service, and full legal support.',
      'Your home deserves the ProperTLV touch.',
    ],
    highlights: [
      'Strategic marketing for qualified buyers',
      'Seamless, end-to-end management',
      'Total peace of mind',
    ],
    highlightsTitle: 'Why choose exclusivity with us?',
    bullets: [],
    groups: [
      {
        title: '1. Premium Marketing Package',
        image: '/assets/sales-package/premium-marketing.jpg',
        imageAlt: 'Professionally staged living room prepared for a ProperTLV listing',
        secondaryImage: '/assets/sales-package/premium-brochure.png',
        secondaryImageAlt: 'Custom-designed luxury property brochure mockup',
        items: [
          'Professional photography and videography — includes cinematic video tours and aerial drone footage (if relevant)',
          'Interior design consultation and staging — our in-house design team ensures the home looks its absolute best',
          'Custom-designed digital and print brochure — luxury-grade marketing materials with multilingual options (Hebrew, English, French, and Russian)',
        ],
      },
      {
        title: '2. Elite Exposure & Network',
        image: '/assets/sales-package/elite-exposure-1.jpg',
        imageAlt: 'ProperTLV social media marketing reach and audience engagement',
        secondaryImage: '/assets/sales-package/elite-exposure-2.jpg',
        secondaryImageAlt: 'Premium property portals and international listing exposure',
        items: [
          '17+ years of high-end real estate expertise — deep roots in the local market and international buyer community',
          'Exclusive access to our client network — mailing list of over 5,000 pre-qualified buyers, many of whom are overseas investors or relocating families',
          'Instagram: 23K+ active, high-end followers',
          'Facebook: 2.1K+ curated audience and posting in exclusive realtor groups',
          'Regular content shared for your property via reels, posts, and stories with strong engagement',
          'LinkedIn page: 1,200 close connections',
          'Listing on premium portals — local and international platforms (e.g. Yad2, Madlan, OnMap, Google Ads, website, international portals if applicable)',
        ],
      },
      {
        title: '3. Personalized Promotion Strategy',
        image: '/assets/sales-package/promotion-strategy.jpg',
        imageAlt: 'ProperTLV agent hosting a private property tour for qualified buyers',
        items: [
          'Dedicated marketing plan for your property — tailored to your home’s unique features and target buyer demographics',
          'WhatsApp and direct messaging campaigns — property sent directly to our personal agent contact list (VIP buyers, ambassadors, relocation agencies) and colleagues in the industry',
          'Open houses and private tours — organized for qualified buyers only, with guided tours by a senior agent',
        ],
      },
      {
        title: '4. White Glove Service',
        image: '/assets/sales-package/white-glove.jpg',
        imageAlt: 'ProperTLV agent providing attentive white-glove client service',
        items: [
          'Single point of contact — full accountability and availability; one agent handling everything, with no confusion',
          'Clear communication and updates — monthly performance reports and buyer feedback',
          'Discreet sales option — for clients who prefer not to advertise publicly (via silent or off-market listings)',
        ],
      },
      {
        title: '5. Maximize Your Sale Price',
        image: '/assets/sales-package/maximize-sale-1.jpg',
        imageAlt: 'Luxury Tel Aviv apartment interior marketed by ProperTLV',
        secondaryImage: '/assets/sales-package/maximize-sale-2.jpg',
        secondaryImageAlt: 'High-end property presentation showcasing sale value',
        items: [
          'Strategic pricing advisory — based on real-time data and luxury market trends',
          'Offer and negotiation management — we manage every step to secure the highest possible sale price from the right buyer',
          'Experience with high-stakes transactions — proven results with multi-million shekel and euro properties',
        ],
      },
    ],
    showcaseImages: [
      {
        src: '/assets/sales-package/showcase-1.jpg',
        alt: 'ProperTLV exclusive listing — elegant living space',
      },
      {
        src: '/assets/sales-package/showcase-2.jpg',
        alt: 'ProperTLV exclusive listing — designer kitchen',
      },
      {
        src: '/assets/sales-package/showcase-3.jpg',
        alt: 'ProperTLV exclusive listing — bright bedroom suite',
      },
      {
        src: '/assets/sales-package/showcase-4.jpg',
        alt: 'ProperTLV exclusive listing — rooftop terrace views',
      },
      {
        src: '/assets/sales-package/showcase-5.jpg',
        alt: 'ProperTLV exclusive listing — curated interior details',
      },
      {
        src: '/assets/sales-package/showcase-6.jpg',
        alt: 'ProperTLV exclusive listing — premium bathroom finish',
      },
      {
        src: '/assets/sales-package/showcase-7.jpg',
        alt: 'ProperTLV exclusive listing — outdoor entertaining area',
      },
      {
        src: '/assets/sales-package/showcase-8.jpg',
        alt: 'ProperTLV exclusive listing — architectural Tel Aviv home',
      },
    ],
    ctaLabel: 'Speak with ProperTLV about the package',
    ctaHref: '/contact?interest=selling',
  },

  salesPackageClosing: {
    title: 'We look forward to working with you',
    subtitle: 'Reach out to start your exclusive sales journey with ProperTLV.',
    ctaLabel: 'Contact ProperTLV',
  },

  salesTeam: {
    accent: 'The Team',
    title: 'The Team',
    subtitle: 'The people behind ProperTLV’s exclusive sales experience.',
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
        id: 'dawn-schuster',
        name: 'Dawn Schuster',
        title: 'Real Estate Agent & Designer',
        bio: 'Born and raised in the UK, Dawn Schuster is a talented estate agent and designer with a sharp eye for potential. As founder of decor and textile company Eventelier, she brings creative vision and market insight to every property, envisioning the maximum potential of a space. Her design expertise helps sellers showcase their homes beautifully, attracting buyers and boosting value.',
        image: '/assets/team/dawn-schuster.jpg',
        imageAlt: 'Portrait of Dawn Schuster, Real Estate Agent and Designer at ProperTLV',
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
  },

  sellerServices: {
    accent: 'For Sellers',
    title: 'Services for Sellers',
    subtitle: 'Present your property at its best — and reach buyers who are serious about Tel Aviv.',
    paragraphs: [
      'Selling a home is about more than posting an ad. ProperTLV helps you position your property accurately, present it beautifully, and connect with buyers who are a genuine fit — whether you choose our full Exclusive Representation Package or focused seller support.',
      'From first valuation conversation through marketing, viewings, and offer review, you have a single point of contact who keeps the process organised, transparent, and discreet when needed.',
    ],
    bullets: [
      'Pricing and positioning advice grounded in the luxury Tel Aviv market',
      'Professional photography, video, staging, and brochure preparation',
      'Targeted marketing across premium portals and our buyer network',
      'Viewing management, buyer screening, and monthly progress updates',
      'Offer review, negotiation support, and closing coordination',
    ],
    ctaLabel: 'Contact ProperTLV about selling',
    ctaHref: '/contact?interest=selling',
  },

  reviews: {
    accent: "Client's Words",
    title: "Client's Words",
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
      url: PLACEHOLDER_GOOGLE_REVIEWS_URL,
      buttonLabel: 'View Google Reviews',
      note: 'Google Business profile link — to be connected when live.',
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
      'Explore ProperTLV listings by neighbourhood. Select a pin to view details — interactive map integration coming soon.',
    placeholderNote:
      'Preview map — connect Google Maps or Mapbox when API credentials are ready.',
    viewProperty: 'View property',
    allNeighborhoods: 'All neighbourhoods',
    listingsCount: '{count} listings',
    saleLabel: 'For sale',
    rentalLabel: 'For rent',
    neighborhoodFallback: 'Approximate neighbourhood pin',
  },
}

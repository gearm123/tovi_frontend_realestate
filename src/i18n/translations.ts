import type { Locale } from './types'

const en = {
  meta: {
    title: 'PROPERTLV — Tel Aviv Real Estate',
    description: 'PROPERTLV — curated homes and apartments in Tel Aviv.',
  },
  lang: {
    switchToHebrew: 'עברית',
    switchToEnglish: 'English',
    ariaSwitchToHebrew: 'Switch site language to Hebrew',
    ariaSwitchToEnglish: 'Switch site language to English',
  },
  header: {
    tagline: 'Tel Aviv Real Estate',
    navAria: 'Main navigation',
    nav: {
      about: 'About',
      sales: 'All Sales',
      rentals: 'All Rentals',
      sellersPackage: 'Sellers Exclusive Package',
      contact: 'Contact Us',
      magazine: 'PROPERTLV Magazine',
    },
  },
  footer: {
    blurb:
      'Curated homes and apartments across Tel Aviv — from Bauhaus gems on Rothschild to quiet family streets in Ramat Aviv.',
    about: 'About',
    sales: 'All Sales',
    rentals: 'All Rentals',
    magazine: 'Magazine',
    getInTouch: 'Get in Touch',
    address: 'Rothschild Blvd 45, Tel Aviv',
    contactUs: 'Contact Us',
    rights: 'All rights reserved.',
  },
  hero: {
    aria: 'Tel Aviv introduction',
    alt: 'Tel Aviv — animation coming soon',
    scrollHint: 'Scroll to listings',
  },
  home: {
    sectionLabel: "This week's selection",
    title: 'Properties for You',
    intro:
      'Handpicked apartments and homes across Tel Aviv — each one chosen for its light, its neighborhood, and the life you might build there.',
  },
  about: {
    title: 'About PROPERTLV',
    subtitle: 'Finding a home should feel personal — not transactional.',
    p1: 'PROPERTLV connects people with thoughtfully selected properties across Tel Aviv, from Bauhaus gems on Rothschild to quiet family streets in Ramat Aviv. We believe every home has a story, and every search deserves patience, expertise, and care.',
    p2: 'Founded by local specialists who know the city block by block, we guide buyers, sellers, and renters through every step — with transparency, discretion, and a deep respect for what home means.',
    p3: 'Whether you are looking for a sea-view penthouse, a garden-level duplex, or a rental near the park, PROPERTLV is here to help you find the right fit.',
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'Tell us what you are looking for and we will get back to you.',
    reachUs: 'Reach us at',
    or: 'or',
    address: 'Rothschild Blvd 45, Tel Aviv.',
  },
  contactForm: {
    success: 'Thank you for reaching out. We will be in touch shortly.',
    legend: 'I am interested in',
    selling: 'Selling a property',
    buying: 'Buying a property',
    renting: 'Renting a property',
    general: 'General inquiry',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    submit: 'Send message',
  },
  sellersPackage: {
    title: 'Sellers Exclusive Package',
    subtitle: 'A premium, end-to-end service for homeowners who expect more.',
    intro:
      'The PROPERTLV Sellers Exclusive Package is designed for property owners who want a discreet, high-touch sale experience. From professional staging and photography to targeted marketing and qualified buyer screening, we handle every detail.',
    items: [
      'Professional photography and video tour',
      'Curated listing across premium channels',
      'Dedicated agent and weekly progress reports',
      'Negotiation support and legal coordination',
      'Exclusive buyer network access',
    ],
    cta: 'Enquire about the package',
  },
  magazine: {
    title: 'PROPERTLV Magazine',
    subtitle: "Stories, guides, and insights from Tel Aviv's property scene.",
    readMore: 'Read more',
    articles: [
      {
        title: 'Bauhaus Tel Aviv: A Living Heritage',
        excerpt:
          "How the White City's architectural legacy continues to shape modern living and property values.",
        date: 'March 2026',
      },
      {
        title: 'Neighbourhood Guide: Florentin',
        excerpt:
          'From artist studios to rooftop bars — why creatives and young professionals are calling Florentin home.',
        date: 'February 2026',
      },
      {
        title: 'The Rental Market in 2026',
        excerpt:
          'What buyers and renters need to know about prices, demand, and emerging hotspots across the city.',
        date: 'January 2026',
      },
    ],
  },
  sales: {
    title: 'All Sales',
    subtitle: 'Browse every property currently for sale across Tel Aviv.',
    countLabel: '{count} properties',
    listingsTitle: 'Properties for Sale',
  },
  rentals: {
    title: 'All Rentals',
    subtitle: 'Discover apartments and homes available for rent in Tel Aviv.',
    countLabel: '{count} properties',
    listingsTitle: 'Properties for Rent',
  },
  filters: {
    aria: 'Property search filters',
    neighborhood: 'Neighbourhood',
    allNeighborhoods: 'All neighbourhoods',
    propertyType: 'Property type',
    allTypes: 'All types',
    roomsBeds: 'Rooms / beds',
    any: 'Any',
    roomsPlus: '{count}+',
    monthlyRent: 'Monthly rent',
    price: 'Price',
    priceRange: '{label}: ₪{min} – ₪{max}',
    minPrice: 'Minimum price',
    maxPrice: 'Maximum price',
    extraFilters: 'Extra filters',
    clear: 'Clear filters',
    features: {
      balcony: 'Balcony',
      parking: 'Parking',
      elevator: 'Elevator',
      mamad: 'Mamad',
      miklat: 'Miklat',
      petsAllowed: 'Pets allowed',
    },
  },
  propertyTypes: {
    apartment: 'Apartment',
    house: 'House',
    penthouse: 'Penthouse',
    duplex: 'Duplex',
    loft: 'Loft',
  },
  neighborhoods: {
    'Lev HaIr': 'Lev HaIr',
    'Neve Tzedek': 'Neve Tzedek',
    Namal: 'Namal',
    Tzameret: 'Tzameret',
    Florentin: 'Florentin',
    'Ramat Aviv': 'Ramat Aviv',
    'Old North': 'Old North',
    Sarona: 'Sarona',
  },
  property: {
    bed: 'bed',
    bath: 'bath',
    viewDetails: 'View details',
    forSale: 'For Sale',
    forRent: 'For Rent',
    featured: 'Featured',
    features: 'Features',
    contactCta: 'Contact us about this property',
    backToListings: 'Back to listings',
    notFound: 'Property not found',
    returnHome: 'Return home',
    yes: '✓',
    no: '—',
  },
}

const he: TranslationTree = {
  meta: {
    title: 'PROPERTLV — נדל״ן בתל אביב',
    description: 'PROPERTLV — דירות ובתים נבחרים בתל אביב.',
  },
  lang: {
    switchToHebrew: 'עברית',
    switchToEnglish: 'English',
    ariaSwitchToHebrew: 'החלפת שפת האתר לעברית',
    ariaSwitchToEnglish: 'החלפת שפת האתר לאנגלית',
  },
  header: {
    tagline: 'נדל״ן בתל אביב',
    navAria: 'ניווט ראשי',
    nav: {
      about: 'אודות',
      sales: 'כל הנכסים למכירה',
      rentals: 'כל הנכסים להשכרה',
      sellersPackage: 'חבילת מוכרים בלעדית',
      contact: 'צור קשר',
      magazine: 'מגזין PROPERTLV',
    },
  },
  footer: {
    blurb:
      'דירות ובתים נבחרים ברחבי תל אביב — מפנינות באוהאוס ברוטשילד ועד רחובות שקטים למשפחות ברמת אביב.',
    about: 'אודות',
    sales: 'כל הנכסים למכירה',
    rentals: 'כל הנכסים להשכרה',
    magazine: 'מגזין',
    getInTouch: 'דברו איתנו',
    address: 'שדרות רוטשילד 45, תל אביב',
    contactUs: 'צור קשר',
    rights: 'כל הזכויות שמורות.',
  },
  hero: {
    aria: 'היכרות עם תל אביב',
    alt: 'תל אביב — אנימציה בקרוב',
    scrollHint: 'גלילה לרשימת הנכסים',
  },
  home: {
    sectionLabel: 'הבחירה של השבוע',
    title: 'נכסים בשבילכם',
    intro:
      'דירות ובתים נבחרים ברחבי תל אביב — כל אחד נבחר בזכות האור, השכונה והחיים שאפשר לבנות בו.',
  },
  about: {
    title: 'אודות PROPERTLV',
    subtitle: 'מציאת בית צריכה להרגיש אישית — לא עסקית.',
    p1: 'PROPERTLV מחברת בין אנשים לנכסים נבחרים ברחבי תל אביב, מפנינות באוהאוס ברוטשילד ועד רחובות משפחתיים שקטים ברמת אביב. אנחנו מאמינים שלכל בית יש סיפור, ולכל חיפוש מגיעים סבלנות, מומחיות ודאגה.',
    p2: 'החברה הוקמה על ידי מומחים מקומיים שמכירים את העיר רחוב אחר רחוב. אנחנו מלווים קונים, מוכרים ושוכרים בכל שלב — בשקיפות, בדיסקרטיות ובכבוד עמוק למה שבית אומר.',
    p3: 'בין אם אתם מחפשים פנטהאוז עם נוף לים, דופלקס בקומת גן או דירה להשכרה ליד הפארק — PROPERTLV כאן כדי לעזור לכם למצוא את ההתאמה הנכונה.',
  },
  contact: {
    title: 'צור קשר',
    subtitle: 'ספרו לנו מה אתם מחפשים ונחזור אליכם.',
    reachUs: 'ניתן ליצור קשר ב',
    or: 'או',
    address: 'שדרות רוטשילד 45, תל אביב.',
  },
  contactForm: {
    success: 'תודה שפניתם אלינו. ניצור קשר בקרוב.',
    legend: 'אני מעוניין/ת ב',
    selling: 'מכירת נכס',
    buying: 'רכישת נכס',
    renting: 'השכרת נכס',
    general: 'פנייה כללית',
    name: 'שם',
    email: 'אימייל',
    phone: 'טלפון',
    message: 'הודעה',
    submit: 'שליחת הודעה',
  },
  sellersPackage: {
    title: 'חבילת מוכרים בלעדית',
    subtitle: 'שירות פרימיום מקצה לקצה לבעלי בתים שמצפים ליותר.',
    intro:
      'חבילת המוכרים הבלעדית של PROPERTLV מיועדת לבעלי נכסים שרוצים חוויית מכירה דיסקרטית ואישית. מהום סטיילינג וצילום מקצועי ועד שיווק ממוקד וסינון קונים מתאימים — אנחנו מטפלים בכל פרט.',
    items: [
      'צילום מקצועי וסיור וידאו',
      'פרסום ממוקד בערוצים פרימיום',
      'סוכן ייעודי ודוחות התקדמות שבועיים',
      'ליווי במשא ומתן ותיאום משפטי',
      'גישה לרשת קונים בלעדית',
    ],
    cta: 'לפרטים על החבילה',
  },
  magazine: {
    title: 'מגזין PROPERTLV',
    subtitle: 'סיפורים, מדריכים ותובנות מעולם הנדל״ן בתל אביב.',
    readMore: 'קראו עוד',
    articles: [
      {
        title: 'באוהאוס תל אביב: מורשת חיה',
        excerpt:
          'כיצד המורשת האדריכלית של העיר הלבנה ממשיכה לעצב את החיים המודרניים ואת ערכי הנכסים.',
        date: 'מרץ 2026',
      },
      {
        title: 'מדריך שכונות: פלורנטין',
        excerpt:
          'מסטודיו לאמנים ועד ברים על הגג — למה יוצרים וצעירים מקצועיים בוחרים לגור בפלורנטין.',
        date: 'פברואר 2026',
      },
      {
        title: 'שוק ההשכרה ב-2026',
        excerpt:
          'מה שקונים ושוכרים צריכים לדעת על מחירים, ביקוש ונקודות חמות מתפתחות ברחבי העיר.',
        date: 'ינואר 2026',
      },
    ],
  },
  sales: {
    title: 'כל הנכסים למכירה',
    subtitle: 'עיינו בכל הנכסים הנמצאים כעת למכירה ברחבי תל אביב.',
    countLabel: '{count} נכסים',
    listingsTitle: 'נכסים למכירה',
  },
  rentals: {
    title: 'כל הנכסים להשכרה',
    subtitle: 'גלו דירות ובתים זמינים להשכרה בתל אביב.',
    countLabel: '{count} נכסים',
    listingsTitle: 'נכסים להשכרה',
  },
  filters: {
    aria: 'מסנני חיפוש נכסים',
    neighborhood: 'שכונה',
    allNeighborhoods: 'כל השכונות',
    propertyType: 'סוג נכס',
    allTypes: 'כל הסוגים',
    roomsBeds: 'חדרים / שינה',
    any: 'הכל',
    roomsPlus: '{count}+',
    monthlyRent: 'שכר דירה חודשי',
    price: 'מחיר',
    priceRange: '{label}: ₪{min} – ₪{max}',
    minPrice: 'מחיר מינימום',
    maxPrice: 'מחיר מקסימום',
    extraFilters: 'מסננים נוספים',
    clear: 'ניקוי מסננים',
    features: {
      balcony: 'מרפסת',
      parking: 'חניה',
      elevator: 'מעלית',
      mamad: 'ממ״ד',
      miklat: 'מקלט',
      petsAllowed: 'חיות מחמד מותרות',
    },
  },
  propertyTypes: {
    apartment: 'דירה',
    house: 'בית',
    penthouse: 'פנטהאוז',
    duplex: 'דופלקס',
    loft: 'לופט',
  },
  neighborhoods: {
    'Lev HaIr': 'לב העיר',
    'Neve Tzedek': 'נווה צדק',
    Namal: 'הנמל',
    Tzameret: 'צמרת',
    Florentin: 'פלורנטין',
    'Ramat Aviv': 'רמת אביב',
    'Old North': 'הצפון הישן',
    Sarona: 'שרונה',
  },
  property: {
    bed: 'חדרי שינה',
    bath: 'חדרי רחצה',
    viewDetails: 'לפרטים',
    forSale: 'למכירה',
    forRent: 'להשכרה',
    featured: 'נבחר',
    features: 'מאפיינים',
    contactCta: 'צרו קשר לגבי נכס זה',
    backToListings: 'חזרה לרשימה',
    notFound: 'הנכס לא נמצא',
    returnHome: 'חזרה לדף הבית',
    yes: '✓',
    no: '—',
  },
}

export type TranslationTree = typeof en

export const translations: Record<Locale, TranslationTree> = { en, he }

export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(params[key] ?? `{${key}}`),
  )
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'he' ? 'rtl' : 'ltr'
}

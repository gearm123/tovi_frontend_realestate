import type { Locale } from '../i18n/types'

export type StaticSeoPageKey =
  | 'home'
  | 'about'
  | 'sales'
  | 'rentals'
  | 'search'
  | 'services'
  | 'sellersPackage'
  | 'contact'
  | 'magazine'

export interface PageSeoEntry {
  title: string
  description: string
  path: string
}

type SeoCatalog = Record<Locale, Record<StaticSeoPageKey, PageSeoEntry>>

export const pageSeoCatalog: SeoCatalog = {
  en: {
    home: {
      title: 'PROPERTLV — Tel Aviv Real Estate',
      description:
        'ProperTLV — boutique English-speaking real estate in Tel Aviv. Luxury apartments for sale and rent, buyer and seller services, and personal guidance.',
      path: '/',
    },
    about: {
      title: 'About ProperTLV — Tel Aviv Real Estate Agency',
      description:
        'Meet ProperTLV — a boutique Tel Aviv agency offering personal buyer and seller guidance across the city.',
      path: '/about',
    },
    sales: {
      title: 'Properties for Sale in Tel Aviv — ProperTLV',
      description:
        'Browse apartments and homes for sale across Tel Aviv with ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'Apartments for Rent in Tel Aviv — ProperTLV',
      description:
        'Discover apartments and homes available for rent in Tel Aviv with ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'Search Tel Aviv Properties — ProperTLV',
      description:
        'Filter Tel Aviv homes by status, type, rooms, price, and neighbourhood with ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'Real Estate Services — ProperTLV Tel Aviv',
      description:
        'Buyer and seller services, relocation support, and the ProperTLV Exclusive Representation Package.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Sellers Exclusive Package — ProperTLV',
      description:
        'Premium marketing, staging, and exclusive representation for selling your Tel Aviv property with ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Contact ProperTLV — Tel Aviv Real Estate',
      description:
        'Get in touch with ProperTLV — 83 Ben Yehuda St, Tel Aviv. Phone 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'ProperTLV Magazine — Tel Aviv Property Insights',
      description:
        'Stories, neighbourhood guides, and market insights from Tel Aviv\'s property scene.',
      path: '/magazine',
    },
  },
  he: {
    home: {
      title: 'PROPERTLV — נדל״ן בתל אביב',
      description:
        'ProperTLV — סוכנות נדל״ן בוטיק דוברת אנגלית בתל אביב. דירות יוקרה למכירה ולהשכרה, שירותי קונים ומוכרים וליווי אישי.',
      path: '/',
    },
    about: {
      title: 'אודות ProperTLV — סוכנות נדל״ן בתל אביב',
      description:
        'הכירו את ProperTLV — סוכנות בוטיק בתל אביב עם ליווי אישי לקונים ומוכרים.',
      path: '/about',
    },
    sales: {
      title: 'נכסים למכירה בתל אביב — ProperTLV',
      description: 'עיינו בדירות ובתים למכירה ברחבי תל אביב עם ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'דירות להשכרה בתל אביב — ProperTLV',
      description: 'גלו דירות ובתים להשכרה בתל אביב עם ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'חיפוש נכסים בתל אביב — ProperTLV',
      description: 'סננו דירות לפי סטטוס, סוג, חדרים, מחיר ושכונה עם ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'שירותי נדל״ן — ProperTLV תל אביב',
      description: 'שירותי קונים ומוכרים, ליווי לעולים, וחבילת ייצוג בלעדי של ProperTLV.',
      path: '/services',
    },
    sellersPackage: {
      title: 'חבילת מוכרים בלעדית — ProperTLV',
      description: 'שיווק פרימיום, עיצוב והיצוג בלעדי למכירת הנכס שלכם בתל אביב עם ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'צור קשר — ProperTLV נדל״ן תל אביב',
      description:
        'דברו עם ProperTLV — בן יהודה 83, תל אביב. טלפון 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'מגזין ProperTLV — תובנות נדל״ן בתל אביב',
      description: 'סיפורים, מדריכי שכונות ותובנות שוק מעולם הנדל״ן בתל אביב.',
      path: '/magazine',
    },
  },
  fr: {
    home: {
      title: 'PROPERTLV — Immobilier à Tel Aviv',
      description: 'ProperTLV — appartements et maisons sélectionnés à Tel Aviv.',
      path: '/',
    },
    about: {
      title: 'À propos — ProperTLV',
      description: 'ProperTLV — agence immobilière boutique à Tel Aviv.',
      path: '/about',
    },
    sales: {
      title: 'Biens à vendre — ProperTLV',
      description: 'Parcourez les biens en vente à Tel Aviv.',
      path: '/sales',
    },
    rentals: {
      title: 'Locations — ProperTLV Tel Aviv',
      description: 'Découvrez les appartements à louer à Tel Aviv.',
      path: '/rentals',
    },
    search: {
      title: 'Recherche — ProperTLV',
      description: 'Filtrez les biens à Tel Aviv par critères.',
      path: '/properties',
    },
    services: {
      title: 'Services — ProperTLV',
      description: 'Services acheteurs et vendeurs à Tel Aviv.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Package vendeur exclusif — ProperTLV',
      description: 'Marketing premium et représentation exclusive à Tel Aviv.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Contact — ProperTLV',
      description: 'Contactez ProperTLV à Tel Aviv.',
      path: '/contact',
    },
    magazine: {
      title: 'Magazine ProperTLV',
      description: 'Guides et analyses immobilières à Tel Aviv.',
      path: '/magazine',
    },
  },
  ru: {
    home: {
      title: 'PROPERTLV — Недвижимость в Тель-Авиве',
      description: 'ProperTLV — отобранные квартиры и дома в Тель-Авиве.',
      path: '/',
    },
    about: {
      title: 'О нас — ProperTLV',
      description: 'ProperTLV — бутик-агентство недвижимости в Тель-Авиве.',
      path: '/about',
    },
    sales: {
      title: 'Продажа — ProperTLV',
      description: 'Объекты на продажу в Тель-Авиве.',
      path: '/sales',
    },
    rentals: {
      title: 'Аренда — ProperTLV',
      description: 'Квартиры в аренду в Тель-Авиве.',
      path: '/rentals',
    },
    search: {
      title: 'Поиск — ProperTLV',
      description: 'Фильтр объектов в Тель-Авиве.',
      path: '/properties',
    },
    services: {
      title: 'Услуги — ProperTLV',
      description: 'Услуги для покупателей и продавцов.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Эксклюзивный пакет для продавцов — ProperTLV',
      description: 'Премиум-маркетинг и эксклюзивное представительство.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Контакты — ProperTLV',
      description: 'Свяжитесь с ProperTLV в Тель-Авиве.',
      path: '/contact',
    },
    magazine: {
      title: 'Журнал ProperTLV',
      description: 'Материалы о рынке недвижимости Тель-Авива.',
      path: '/magazine',
    },
  },
}

export function getStaticPageSeo(
  pageKey: StaticSeoPageKey,
  locale: Locale,
): PageSeoEntry {
  return pageSeoCatalog[locale][pageKey]
}

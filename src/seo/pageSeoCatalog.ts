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
  | 'guides'

export interface PageSeoEntry {
  title: string
  description: string
  path: string
}

type SeoCatalog = Record<Locale, Record<StaticSeoPageKey, PageSeoEntry>>

export const pageSeoCatalog: SeoCatalog = {
  en: {
    home: {
      title: 'PROPERTLV | Tel Aviv Real Estate',
      description:
        'ProperTLV is boutique English-speaking real estate in Tel Aviv. Luxury apartments for sale and rent, buyer and seller services, and personal guidance.',
      path: '/',
    },
    about: {
      title: 'About ProperTLV | Tel Aviv Real Estate Agency',
      description:
        'Meet ProperTLV, a boutique Tel Aviv agency offering personal buyer and seller guidance across the city.',
      path: '/about',
    },
    sales: {
      title: 'Properties for Sale in Tel Aviv | ProperTLV',
      description:
        'Browse apartments and homes for sale across Tel Aviv with ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'Apartments for Rent in Tel Aviv | ProperTLV',
      description:
        'Discover apartments and homes available for rent in Tel Aviv with ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'Search Tel Aviv Properties | ProperTLV',
      description:
        'Filter Tel Aviv homes by status, type, rooms, price, and neighbourhood with ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'Real Estate Services | ProperTLV Tel Aviv',
      description:
        'Buyer and seller services, relocation support, and the ProperTLV Exclusive Representation Package.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Sellers Exclusive Package | ProperTLV',
      description:
        'Premium marketing, staging, and exclusive representation for selling your Tel Aviv property with ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Contact ProperTLV | Tel Aviv Real Estate',
      description:
        'Get in touch with ProperTLV at 83 Ben Yehuda St, Tel Aviv. Phone 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'ProperTLV Magazine | Tel Aviv Property Insights',
      description:
        'Stories, neighbourhood guides, and market insights from Tel Aviv\'s property scene.',
      path: '/magazine',
    },
    guides: {
      title: 'Guides | ProperTLV',
      description:
        'Presentations for buyers, people moving to Israel, and real estate investors, from ProperTLV.',
      path: '/guides',
    },
  },
  he: {
    home: {
      title: 'PROPERTLV | נדל״ן בתל אביב',
      description:
        'ProperTLV היא סוכנות נדל״ן בוטיק דוברת אנגלית בתל אביב. דירות יוקרה למכירה ולהשכרה, שירותי קונים ומוכרים וליווי אישי.',
      path: '/',
    },
    about: {
      title: 'אודות ProperTLV | סוכנות נדל״ן בתל אביב',
      description:
        'הכירו את ProperTLV, סוכנות בוטיק בתל אביב עם ליווי אישי לקונים ומוכרים.',
      path: '/about',
    },
    sales: {
      title: 'נכסים למכירה בתל אביב | ProperTLV',
      description: 'עיינו בדירות ובתים למכירה ברחבי תל אביב עם ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'דירות להשכרה בתל אביב | ProperTLV',
      description: 'גלו דירות ובתים להשכרה בתל אביב עם ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'חיפוש נכסים בתל אביב | ProperTLV',
      description: 'סננו דירות לפי סטטוס, סוג, חדרים, מחיר ושכונה עם ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'שירותי נדל״ן | ProperTLV תל אביב',
      description: 'שירותי קונים ומוכרים, ליווי לעולים, וחבילת ייצוג בלעדי של ProperTLV.',
      path: '/services',
    },
    sellersPackage: {
      title: 'חבילת מוכרים בלעדית | ProperTLV',
      description: 'שיווק פרימיום, עיצוב והיצוג בלעדי למכירת הנכס שלכם בתל אביב עם ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'צור קשר | ProperTLV נדל״ן תל אביב',
      description:
        'דברו עם ProperTLV בבן יהודה 83, תל אביב. טלפון 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'מגזין ProperTLV | תובנות נדל״ן בתל אביב',
      description: 'סיפורים, מדריכי שכונות ותובנות שוק מעולם הנדל״ן בתל אביב.',
      path: '/magazine',
    },
    guides: {
      title: 'מדריכים | ProperTLV',
      description: 'מצגות לקונים, למי שעובר לישראל ולמשקיעי נדל״ן, מבית ProperTLV.',
      path: '/guides',
    },
  },
  fr: {
    home: {
      title: 'PROPERTLV | Immobilier à Tel Aviv',
      description:
        'ProperTLV est une agence immobilière boutique anglophone à Tel Aviv. Appartements de standing à vendre et à louer, services acheteurs et vendeurs, accompagnement personnel.',
      path: '/',
    },
    about: {
      title: 'À propos de ProperTLV | Agence immobilière à Tel Aviv',
      description:
        'Découvrez ProperTLV, agence boutique à Tel Aviv qui accompagne personnellement acheteurs et vendeurs dans toute la ville.',
      path: '/about',
    },
    sales: {
      title: 'Biens à vendre à Tel Aviv | ProperTLV',
      description:
        'Parcourez les appartements et maisons à vendre à Tel Aviv avec ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'Appartements à louer à Tel Aviv | ProperTLV',
      description:
        'Découvrez les appartements et maisons disponibles à la location à Tel Aviv avec ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'Rechercher un bien à Tel Aviv | ProperTLV',
      description:
        'Filtrez les logements à Tel Aviv par statut, type, pièces, prix et quartier avec ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'Services immobiliers | ProperTLV Tel Aviv',
      description:
        'Services pour acheteurs et vendeurs, aide à l’installation, et formule de représentation exclusive ProperTLV.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Formule exclusive vendeurs | ProperTLV',
      description:
        'Marketing premium, mise en valeur et représentation exclusive pour vendre votre bien à Tel Aviv avec ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Contacter ProperTLV | Immobilier à Tel Aviv',
      description:
        'Contactez ProperTLV au 83 rue Ben Yehuda, Tel Aviv. Téléphone 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'Magazine ProperTLV | Le marché immobilier de Tel Aviv',
      description:
        'Récits, guides de quartiers et analyses du marché immobilier à Tel Aviv.',
      path: '/magazine',
    },
    guides: {
      title: 'Guides | ProperTLV',
      description:
        'Présentations pour les acheteurs, les personnes qui s’installent en Israël et pour les investisseurs immobiliers, par ProperTLV.',
      path: '/guides',
    },
  },
  ru: {
    home: {
      title: 'PROPERTLV | Недвижимость в Тель-Авиве',
      description:
        'ProperTLV — бутик-агентство недвижимости в Тель-Авиве на английском языке. Квартиры на продажу и в аренду, услуги для покупателей и продавцов и личное сопровождение.',
      path: '/',
    },
    about: {
      title: 'О ProperTLV | Агентство недвижимости в Тель-Авиве',
      description:
        'ProperTLV — бутик-агентство в Тель-Авиве с личным сопровождением покупателей и продавцов по всему городу.',
      path: '/about',
    },
    sales: {
      title: 'Недвижимость на продажу в Тель-Авиве | ProperTLV',
      description:
        'Смотрите квартиры и дома на продажу по всему Тель-Авиву с ProperTLV.',
      path: '/sales',
    },
    rentals: {
      title: 'Квартиры в аренду в Тель-Авиве | ProperTLV',
      description:
        'Квартиры и дома, доступные в аренду в Тель-Авиве, с ProperTLV.',
      path: '/rentals',
    },
    search: {
      title: 'Поиск недвижимости в Тель-Авиве | ProperTLV',
      description:
        'Фильтр жилья в Тель-Авиве по статусу, типу, комнатам, цене и району с ProperTLV.',
      path: '/properties',
    },
    services: {
      title: 'Услуги по недвижимости | ProperTLV Тель-Авив',
      description:
        'Услуги для покупателей и продавцов, помощь при переезде и пакет эксклюзивного представительства ProperTLV.',
      path: '/services',
    },
    sellersPackage: {
      title: 'Эксклюзивный пакет для продавцов | ProperTLV',
      description:
        'Премиум-маркетинг, подготовка объекта и эксклюзивное представительство при продаже недвижимости в Тель-Авиве с ProperTLV.',
      path: '/sellers-package',
    },
    contact: {
      title: 'Связаться с ProperTLV | Недвижимость в Тель-Авиве',
      description:
        'Свяжитесь с ProperTLV: улица Бен-Йехуда 83, Тель-Авив. Телефон 058-6270099, office@propertlv.com.',
      path: '/contact',
    },
    magazine: {
      title: 'Журнал ProperTLV | Рынок недвижимости Тель-Авива',
      description:
        'Истории, гиды по районам и обзоры рынка недвижимости Тель-Авива.',
      path: '/magazine',
    },
    guides: {
      title: 'Гиды | ProperTLV',
      description:
        'Презентации для покупателей, тех, кто переезжает в Израиль, и для инвесторов в недвижимость, от ProperTLV.',
      path: '/guides',
    },
  },
}

export function getStaticPageSeo(
  pageKey: StaticSeoPageKey,
  locale: Locale,
): PageSeoEntry {
  return pageSeoCatalog[locale][pageKey]
}

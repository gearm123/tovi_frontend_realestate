import type { Locale } from './types'

type PropertyTranslation = {
  title: string
  address: string
  description: string
  price?: string
}

const he: Record<string, PropertyTranslation> = {
  '1': {
    title: 'דירת באוהאוס מוארת ברוטשילד',
    address: 'שדרות רוטשילד 42, תל אביב',
    description:
      'דירה משוחזרת משנות ה-30 עם תקרות גבוהות, רצפת טרצו מקורית ומרפסת שקטה עם נוף לשדרה. אור הבוקר ממלא כל חדר.',
  },
  '2': {
    title: 'דופלקס בקומת גן בנווה צדק',
    address: 'רחוב שבזי 18, תל אביב',
    description:
      'שני מפלסים היוצאים לחצר פרטית. אבן חמה, קירות טיח רכים ומטבח שנבנה לארוחות ארוכות עם חברים.',
  },
  '3': {
    title: 'פנטהאוז עם נשימת ים, נמל תל אביב',
    address: 'רחוב התערוכה 3, תל אביב',
    description:
      'דירת קומה עליונה עם מרפסת מקיפה. צפו בעיר מתעוררת מעל הים התיכון מהגן על הגג שלכם.',
  },
  '4': {
    title: 'פינה שקטה בצפון הישן',
    address: 'רחוב בן יהודה 156, תל אביב',
    description:
      'רחוב עצי ושקט במרחק דקות מהחוף. שופץ לאחרונה עם רצפת אלון וחלל מגורים רגוע ומלא אור.',
  },
  '5': {
    title: 'לופט עם אופי בפלורנטין',
    address: 'רחוב סלמה 28, תל אביב',
    description:
      'לבנים חשופות, קורות פלדה וקיר חלונות. אנרגיה יצירתית פוגשת נוחות יומיומית באחד הרבעים האהובים בעיר.',
  },
  '6': {
    title: 'בית משפחתי ליד פארק הירקון',
    address: 'רחוב איינשטיין 12, תל אביב',
    description:
      'מרווח ושלו — בית למשפחות שרוצות פארקים, בתי ספר והים במרחק נגיעה.',
  },
  r1: {
    title: 'השכרת באוהאוס ברוטשילד',
    address: 'שדרות רוטשילד 88, תל אביב',
    description:
      'דירת באוהאוס אלגנטית עם תקרות גבוהות ומרפסת גג משותפת. צעדים מבתי קפה, גלריות ולב העיר.',
    price: '₪12,500 לחודש',
  },
  r2: {
    title: 'דירה מודרנית בשרונה',
    address: 'רחוב קפלן 5, תל אביב',
    description:
      'דירה חדשה במגדל עם נוף לגני שרונה. חלונות מהרצפה לתקרה, קונסיירז׳ וחניה תת-קרקעית.',
    price: '₪18,000 לחודש',
  },
  r3: {
    title: 'סטודיו מקסים בפלורנטין',
    address: 'רחוב ויטל 14, תל אביב',
    description:
      'סטודיו קומפקטי ומואר בלב היצירתי של פלורנטין. מושלם לאנשי מקצוע שרוצים חיי לילה ותרבות בהליכה.',
    price: '₪6,800 לחודש',
  },
  r4: {
    title: 'דירת גן בצפון הישן',
    address: 'רחוב דיזנגוף 210, תל אביב',
    description:
      'דירת קומת קרקע עם גינה פרטית, אידיאלית למשפחות. רחוב שקט, דקות מהחוף ומבתי ספר מובילים.',
    price: '₪14,200 לחודש',
  },
}

export function getLocalizedProperty(
  id: string,
  locale: Locale,
  fallback: PropertyTranslation & { neighborhood: string },
) {
  if (locale === 'en') {
    return {
      title: fallback.title,
      address: fallback.address,
      description: fallback.description,
      price: fallback.price,
      neighborhood: fallback.neighborhood,
    }
  }

  const translated = he[id]
  return {
    title: translated?.title ?? fallback.title,
    address: translated?.address ?? fallback.address,
    description: translated?.description ?? fallback.description,
    price: translated?.price ?? fallback.price,
    neighborhood: fallback.neighborhood,
  }
}

/**
 * Project brands stay in their English spelling in every automatic translation.
 * Longer names come first so "DUO Tel Aviv" is kept whole before "DUO".
 */
const PROTECTED_PROJECT_NAMES = [
  'David Promenade - Kempinski',
  'David Promenade – Kempinski',
  'David Promenade — Kempinski',
  'David Promenade Residences',
  'David Promenade',
  'Mandarin Oriental Tel Aviv',
  'Mandarin Oriental',
  'Herbert Samuel Waterfront',
  'Assuta Village Project',
  'Assuta Village',
  'Lieber Tower',
  'Frishman Tower',
  'Kempinski Tower',
  'DUO Tel Aviv',
  'David Kempinski',
  'Rainbow',
  'DUO',
  'Kempinski',
  'ProperTLV',
  'Gindi',
  'Sarona',
]

const NAME_PATTERN = new RegExp(
  PROTECTED_PROJECT_NAMES.map((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return `(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`
  }).join('|'),
  'gu',
)

export function shieldProjectNames(text: string): { text: string; tokens: string[] } {
  const tokens: string[] = []
  const shielded = text.replace(NAME_PATTERN, (name) => {
    const token = `XQN${tokens.length}NXQ`
    tokens.push(name)
    return token
  })
  return { text: shielded, tokens }
}

export function restoreProjectNames(text: string, tokens: string[]): string {
  return tokens.reduce((value, name, index) => {
    const exact = `XQN${index}NXQ`
    const loose = new RegExp(`XQN\\s*${index}\\s*NXQ`, 'g')
    return value.replaceAll(exact, name).replace(loose, name)
  }, text)
}

type StoredLocale = 'he' | 'fr' | 'ru'

type StoredNameFix = [RegExp, string | ((match: string, prefix: string) => string)]

function keepHebrewPrefix(name: string) {
  return (_match: string, prefix: string) => (prefix ? `${prefix}-${name}` : name)
}

/**
 * Fixes names already stored by the translator in Hebrew, French, or Russian.
 * These are the forms the translator produced for the protected brands.
 */
const STORED_NAME_FIXES: Record<StoredLocale, StoredNameFix[]> = {
  he: [
    [/(?<![א-ת])([בלהוכמש]?)מנדרין אוריינטל/g, keepHebrewPrefix('Mandarin Oriental')],
    [/דיוויד קמפינסקי/g, 'David Kempinski'],
    [/דוד קמפינסקי/g, 'David Kempinski'],
    [/דיוויד טיילת מגורים/g, 'David Promenade Residences'],
    [/טיילת דוד/g, 'David Promenade'],
    [/(?<![א-ת])([בלהוכמש]?)קמפינסקי/g, keepHebrewPrefix('Kempinski')],
    [/(?<![א-ת])([בלהוכמש]?)גינדי/g, keepHebrewPrefix('Gindi')],
    [/(?<![א-ת])([בלהוכמש]?)שרונה/g, keepHebrewPrefix('Sarona')],
  ],
  fr: [
    [/Promenade David\s*[-–—]\s*Kempinski/gi, 'David Promenade - Kempinski'],
    [/Promenade David/gi, 'David Promenade'],
    [/(?:le |la |un |une )?village d['’]Assuta/gi, 'Assuta Village'],
    [/Arc-en-ciel/gi, 'Rainbow'],
    [/Tour Lieber/gi, 'Lieber Tower'],
    [/Tour Frishman/gi, 'Frishman Tower'],
    [/(?:La|la|Le|le)\s+(Lieber Tower|Frishman Tower)/g, '$1'],
  ],
  ru: [
    [/Променад Давида\s*[-–—]\s*Кемпински/gi, 'David Promenade - Kempinski'],
    [/Кемпински/g, 'Kempinski'],
    [/(?<![А-Яа-яЁё])[Гг]инди(?![А-Яа-яЁё])/g, 'Gindi'],
    [/(?<![А-Яа-яЁё])[Сс]арон(?:а|ы|е|у|ой|ою)(?![А-Яа-яЁё])/g, 'Sarona'],
    [/ДУЭТ Тель-Авива/g, 'DUO Tel Aviv'],
    [/ДУЭТ/g, 'DUO'],
    [/Дуэт/g, 'DUO'],
    [/[Дд]еревн[яюеи]\s+[Аа]ссут[аыуе]/g, 'Assuta Village'],
    [/пос[её]лок [Аа]ссут[аыуе]/gi, 'Assuta Village'],
    [/(?<![А-Яа-яЁё])[Рр]адуг(?:ой|[аеиоуы])(?![А-Яа-яЁё])/g, 'Rainbow'],
    [/(?<![А-Яа-яЁё])[Бб]ашн[яюеи]\s+[Лл]ибер[аыуе]?(?![А-Яа-яЁё])/g, 'Lieber Tower'],
    [/(?<![А-Яа-яЁё])[Лл]ибер\s+[Тт]ауэр(?![А-Яа-яЁё])/g, 'Lieber Tower'],
    [/(?<![А-Яа-яЁё])[Бб]ашн[яюеи]\s+[Фф]ришман[аыуе]?(?![А-Яа-яЁё])/g, 'Frishman Tower'],
    [/(?<![А-Яа-яЁё])[Фф]ришман\s+[Тт]ауэр(?![А-Яа-яЁё])/g, 'Frishman Tower'],
    [/(?<![А-Яа-яЁё])[Аа]ссут[аыуе](?![А-Яа-яЁё])/g, 'Assuta'],
  ],
}

export function restoreStoredProjectNames(text: string, locale: StoredLocale): string {
  return STORED_NAME_FIXES[locale].reduce((value, [pattern, replacement]) => {
    pattern.lastIndex = 0
    return typeof replacement === 'string'
      ? value.replace(pattern, replacement)
      : value.replace(pattern, replacement)
  }, text)
}

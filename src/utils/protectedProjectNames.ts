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

type StoredLocale = 'fr' | 'ru'

/**
 * Fixes project names already stored in French or Russian.
 * These are the forms the translator produced for the protected brands.
 */
const STORED_NAME_FIXES: Record<StoredLocale, Array<[RegExp, string]>> = {
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
    return value.replace(pattern, replacement)
  }, text)
}

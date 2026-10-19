export type MamadLocale = 'en' | 'he' | 'fr' | 'ru'

const PART = '\u0001'

/**
 * One matcher for every way the safe room has been written.
 * Longer phrases come first so "safe room (mamad)" is one mention.
 */
const MAMAD_PATTERN = new RegExp(
  [
    String.raw`safe\s+rooms?(?:\s*\(\s*mamads?\s*\))?`,
    String.raw`secure\s+rooms?(?:\s*\(\s*mamads?\s*\))?`,
    String.raw`protected\s+rooms?(?:\s*\(\s*mamads?\s*\))?`,
    String.raw`(?:(?:un|une|le|la|l['’])\s+)?coffre-fort\s+priv[eé](?:\s*\(\s*mamads?\s*\))?`,
    String.raw`(?:(?:un|une|le|la|l['’])\s+)?chambres?\s+s[eé]curis[eé]es?(?:\s*\(\s*mamads?\s*\))?`,
    String.raw`(?:(?:un|une|le|la|l['’])\s+)?pi[eè]ces?\s+s[eé]curis[eé]es?(?:\s*\(\s*mamads?\s*\))?`,
    String.raw`сейфовая\s+комната(?:\s*\(\s*мамад\s*\))?`,
    String.raw`безопасн(?:ая|ой|ую)\s+комнат[аыуе]?(?:\s*\(\s*мамад\s*\))?`,
    String.raw`защищённ(?:ая|ой|ую)\s+комнат[аыуе]?(?:\s*\(\s*мамад\s*\))?`,
    String.raw`защищенн(?:ая|ой|ую)\s+комнат[аыуе]?(?:\s*\(\s*мамад\s*\))?`,
    String.raw`[בלהוכמש]?ממ["'״׳\u05F3\u05F4]ד`,
    String.raw`mamads?`,
    String.raw`мамад(?:а|е|ом|у|ы)?`,
  ]
    .map((part) => `(?<![\\p{L}\\p{N}])(?:${part})(?![\\p{L}\\p{N}])`)
    .join('|'),
  'giu',
)

function hebrewPrefix(match: string): string {
  return /^[בלהוכמש]ממ/.test(match) ? match[0] : ''
}

function replaceMamadTerms(
  text: string,
  replace: (index: number) => string,
): string {
  let seen = 0
  return text.replace(MAMAD_PATTERN, (match) => {
    const prefix = hebrewPrefix(match)
    const next = replace(seen)
    seen += 1
    return `${prefix}${next}`
  })
}

function fullForm(locale: MamadLocale): string {
  if (locale === 'fr') return 'chambre sécurisée (mamad)'
  if (locale === 'ru') return 'защищённая комната (мамад)'
  if (locale === 'he') return 'ממ״ד'
  return 'safe room (mamad)'
}

function formAt(locale: MamadLocale, index: number): string {
  if (locale === 'en' && index > 0) return 'mamad'
  return fullForm(locale)
}

/** Rewrites every safe-room mention in one block of text. */
export function applyMamadTerms(text: string, locale: MamadLocale): string {
  return replaceMamadTerms(text, (index) => formAt(locale, index))
}

/** Keeps the first English explanation across a title, summary, and body. */
export function applyMamadTermsAcross(parts: string[], locale: MamadLocale): string[] {
  if (!parts.length) return []
  return applyMamadTerms(parts.map((part) => part ?? '').join(PART), locale).split(PART)
}

export function shieldMamadTerms(text: string): { text: string; count: number } {
  let count = 0
  const shielded = replaceMamadTerms(text, () => {
    const token = `XQM${count}MAD`
    count += 1
    return token
  })
  return { text: shielded, count }
}

/** Puts the full term back after translation. English shortening happens when the text is shown. */
export function restoreMamadTerms(text: string, locale: MamadLocale): string {
  const form = fullForm(locale)
  return text.replace(/XQM\s*(\d+)\s*MAD/g, form)
}

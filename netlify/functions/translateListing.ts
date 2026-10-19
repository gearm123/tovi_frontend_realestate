import type { ListingLocaleCopy, Property } from '../../src/types/property'
import { restoreProjectNames, shieldProjectNames } from '../../src/utils/protectedProjectNames'

export const LISTING_LOCALES = ['en', 'he', 'fr', 'ru'] as const
export type ListingLocale = (typeof LISTING_LOCALES)[number]

function alreadyInLocale(text: string, target: ListingLocale): boolean {
  const hebrew = (text.match(/[\u0590-\u05FF]/g) ?? []).length
  const cyrillic = (text.match(/[\u0400-\u04FF]/g) ?? []).length
  const latin = (text.match(/[A-Za-z]/g) ?? []).length
  if (target === 'he') return hebrew > latin && hebrew > cyrillic
  if (target === 'ru') return cyrillic > latin && cyrillic > hebrew
  if (target === 'en') return latin > 0 && hebrew === 0 && cyrillic === 0
  return false
}

function sourceLanguage(text: string): 'en' | 'he' | 'ru' {
  if (alreadyInLocale(text, 'he')) return 'he'
  if (alreadyInLocale(text, 'ru')) return 'ru'
  return 'en'
}

function chunks(text: string, max: number): string[] {
  if (text.length <= max) return [text]
  const parts: string[] = []
  let rest = text
  while (rest.length > max) {
    const window = rest.slice(0, max)
    const splitAt = Math.max(window.lastIndexOf('. '), window.lastIndexOf(', '), window.lastIndexOf(' '))
    const cut = splitAt > 40 ? splitAt + 1 : max
    parts.push(rest.slice(0, cut).trim())
    rest = rest.slice(cut).trim()
  }
  if (rest) parts.push(rest)
  return parts
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Translation failed')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function readTranslation(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return ''
  const first = data[0] as unknown[]
  if (typeof first[0] === 'string') return first[0]
  return first
    .map((part) => (Array.isArray(part) && typeof part[0] === 'string' ? part[0] : ''))
    .join('')
}

async function googleTranslate(text: string, target: ListingLocale): Promise<string> {
  const url = new URL('https://clients5.google.com/translate_a/t')
  url.searchParams.set('client', 'dict-chrome-ex')
  url.searchParams.set('sl', 'auto')
  url.searchParams.set('tl', target)
  url.searchParams.set('q', text)
  const response = await withTimeout(
    fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }),
    8000,
  )
  if (!response.ok) throw new Error('Translation failed')
  const translated = readTranslation(await response.json()).trim()
  if (!translated) throw new Error('Translation failed')
  return translated
}

async function memoryTranslate(text: string, target: ListingLocale): Promise<string> {
  const pieces = chunks(text, 450)
  const translated: string[] = []
  for (const piece of pieces) {
    const url = new URL('https://api.mymemory.translated.net/get')
    url.searchParams.set('q', piece)
    url.searchParams.set('langpair', `${sourceLanguage(piece)}|${target}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error('Translation failed')
    const data = (await response.json()) as {
      responseData?: { translatedText?: string }
      quotaFinished?: boolean
    }
    const value = data.responseData?.translatedText?.trim() ?? ''
    if (!value || data.quotaFinished || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(value)) {
      throw new Error('Translation failed')
    }
    translated.push(value)
  }
  return translated.join(' ')
}

async function translatePiece(text: string, target: ListingLocale): Promise<string> {
  try {
    return await googleTranslate(text, target)
  } catch {
    return memoryTranslate(text, target)
  }
}

async function translateText(text: string, target: ListingLocale): Promise<string> {
  const value = text.trim()
  if (!value || alreadyInLocale(value, target)) return value
  const shielded = shieldProjectNames(value)
  const pieces = chunks(shielded.text, 900)
  const translated: string[] = []
  for (const piece of pieces) translated.push(await translatePiece(piece, target))
  return restoreProjectNames(translated.join(' '), shielded.tokens)
}

async function translateLines(lines: string[] | undefined, target: ListingLocale): Promise<string[]> {
  const values = (lines ?? []).map((line) => line.trim()).filter(Boolean)
  return Promise.all(values.map((line) => translateText(line, target)))
}

async function translateCopy(property: Property, locale: ListingLocale): Promise<ListingLocaleCopy> {
  const [title, address, description, highlights, specialNotes] = await Promise.all([
    translateText(property.title, locale),
    translateText(property.address, locale),
    translateText(property.description ?? '', locale),
    translateLines(property.highlights, locale),
    translateLines(property.specialNotes, locale),
  ])
  return { title, address, description, highlights, specialNotes }
}

/** Fills the requested languages from the text entered in the admin panel. */
export async function withListingTranslations(
  property: Property,
  locales: readonly ListingLocale[] = LISTING_LOCALES,
): Promise<Property> {
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, await translateCopy(property, locale)] as const),
  )
  return {
    ...property,
    translations: { ...property.translations, ...Object.fromEntries(entries) },
  }
}

export interface MagazineTranslationFields {
  category: string
  title: string
  excerpt: string
  date: string
  body: string[]
  captions?: string[]
  source?: { name: string; url: string; credit: string }
}

async function mapPool<T, R>(items: T[], limit: number, run: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next
      next += 1
      results[index] = await run(items[index])
    }
  })
  await Promise.all(workers)
  return results
}

async function translateParagraphs(paragraphs: string[], locale: ListingLocale): Promise<string[]> {
  const groups: string[][] = []
  let current: string[] = []
  let size = 0
  for (const paragraph of paragraphs) {
    const text = paragraph.trim()
    if (!text) continue
    if (current.length && size + text.length > 1400) {
      groups.push(current)
      current = []
      size = 0
    }
    current.push(text)
    size += text.length + 2
  }
  if (current.length) groups.push(current)

  const translated = await mapPool(groups, 3, async (group) => {
    if (group.length === 1) return [await translateText(group[0], locale)]
    const joined = await translateText(group.join('\n\n'), locale)
    const parts = joined.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
    if (parts.length === group.length) return parts
    const singles: string[] = []
    for (const paragraph of group) singles.push(await translateText(paragraph, locale))
    return singles
  })
  return translated.flat()
}

async function translateMagazineLocale(
  fields: MagazineTranslationFields,
  locale: ListingLocale,
): Promise<MagazineTranslationFields> {
  const [category, title, excerpt, date, body, translatedCaptions, credit] = await Promise.all([
    translateText(fields.category, locale),
    translateText(fields.title, locale),
    translateText(fields.excerpt, locale),
    translateText(fields.date, locale),
    translateParagraphs(fields.body, locale),
    Promise.all((fields.captions ?? []).map((caption) => translateText(caption, locale))),
    fields.source?.credit ? translateText(fields.source.credit, locale) : Promise.resolve(''),
  ])
  return {
    category,
    title,
    excerpt,
    date,
    body,
    captions: translatedCaptions.length ? translatedCaptions : undefined,
    source: fields.source
      ? { name: fields.source.name, url: fields.source.url, credit }
      : undefined,
  }
}

/**
 * Builds copies for the requested languages from the English article text.
 * A language that fails is omitted so the others can still be saved.
 */
export async function translateMagazineFields(
  fields: MagazineTranslationFields,
  locales: readonly ListingLocale[] = LISTING_LOCALES,
): Promise<Partial<Record<ListingLocale, MagazineTranslationFields>>> {
  const entries = await Promise.all(
    locales.map(async (locale) => {
      if (locale === 'en') return [locale, fields] as const
      try {
        return [locale, await translateMagazineLocale(fields, locale)] as const
      } catch (error) {
        console.error(
          error instanceof Error
            ? `Article ${locale} translation failed: ${error.message}`
            : `Article ${locale} translation failed`,
        )
        return [locale, undefined] as const
      }
    }),
  )
  return Object.fromEntries(entries.filter((entry) => entry[1])) as Partial<
    Record<ListingLocale, MagazineTranslationFields>
  >
}

export function listingNeedsTranslation(property: Property, locale: ListingLocale): boolean {
  const copy = property.translations?.[locale]
  if (!copy) return Boolean(property.title || property.description)
  const sample = `${copy.title} ${copy.description}`
  if ((locale === 'he' || locale === 'ru') && property.description) {
    if (!alreadyInLocale(sample, locale) && /[A-Za-z]{4,}/.test(sample)) return true
  }
  if (property.title && !copy.title) return true
  if (property.description && !copy.description) return true
  return false
}

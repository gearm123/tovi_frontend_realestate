import type { ListingLocaleCopy, Property } from '../../src/types/property'

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

async function translateText(text: string, target: ListingLocale): Promise<string> {
  const value = text.trim()
  if (!value || alreadyInLocale(value, target)) return value
  try {
    return await googleTranslate(value, target)
  } catch {
    return memoryTranslate(value, target)
  }
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

/** Builds en, he, fr, and ru copies once, from the text entered in the admin panel. */
export async function withListingTranslations(property: Property): Promise<Property> {
  const entries = await Promise.all(
    LISTING_LOCALES.map(async (locale) => [locale, await translateCopy(property, locale)] as const),
  )
  return { ...property, translations: Object.fromEntries(entries) }
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

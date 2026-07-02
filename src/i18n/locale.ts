import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'propertlv-locale'
const LOCALE_EXPLICIT_KEY = 'propertlv-locale-explicit'

function isLocale(value: string | null): value is Locale {
  return value === 'he' || value === 'en'
}

/** Picks Hebrew or English from the browser's language preferences. */
export function detectBrowserLocale(): Locale {
  const languages =
    typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages
      : typeof navigator !== 'undefined' && navigator.language
        ? [navigator.language]
        : ['he']

  for (const lang of languages) {
    const normalized = lang.toLowerCase()
    if (normalized.startsWith('he') || normalized.startsWith('iw')) {
      return 'he'
    }
    if (normalized.startsWith('en')) {
      return 'en'
    }
  }

  return 'he'
}

/** Resolves locale from an explicit user choice, otherwise the browser language. */
export function readInitialLocale(): Locale {
  try {
    const explicit = localStorage.getItem(LOCALE_EXPLICIT_KEY) === '1'
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (explicit && isLocale(stored)) {
      return stored
    }
  } catch {
    /* ignore */
  }

  return detectBrowserLocale()
}

export function persistLocaleChoice(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    localStorage.setItem(LOCALE_EXPLICIT_KEY, '1')
  } catch {
    /* ignore */
  }
}

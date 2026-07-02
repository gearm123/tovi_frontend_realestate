import type { Locale } from './types'

export const LOCALE_STORAGE_KEY = 'propertlv-locale'
const LOCALE_EXPLICIT_KEY = 'propertlv-locale-explicit'

const DEFAULT_LOCALE: Locale = 'he'

function isLocale(value: string | null): value is Locale {
  return value === 'he' || value === 'en'
}

/** Resolves locale from an explicit user choice, otherwise Hebrew. */
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

  return DEFAULT_LOCALE
}

export function persistLocaleChoice(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    localStorage.setItem(LOCALE_EXPLICIT_KEY, '1')
  } catch {
    /* ignore */
  }
}

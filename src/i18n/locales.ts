import type { Locale } from './types'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'he', 'fr', 'ru']

export const LOCALE_OPTIONS = [
  { code: 'en' as const, label: 'EN', ariaKey: 'ariaSwitchToEnglish' as const },
  { code: 'he' as const, label: 'HE', ariaKey: 'ariaSwitchToHebrew' as const },
  { code: 'fr' as const, label: 'FR', ariaKey: 'ariaSwitchToFrench' as const },
  { code: 'ru' as const, label: 'RU', ariaKey: 'ariaSwitchToRussian' as const },
]

export const NUMBER_FORMAT_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  he: 'he-IL',
  fr: 'fr-FR',
  ru: 'ru-RU',
}

/**
 * Site-wide SEO and analytics configuration.
 * Set VITE_SITE_URL and VITE_GA_MEASUREMENT_ID in Netlify / .env.local at build time.
 */

const DEFAULT_SITE_URL = 'https://propertlv.com'

export function getSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined
  const base = (raw?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')
  return base
}

export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/assets/properties/1.jpg`
}

export function getGoogleAnalyticsId(): string | undefined {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
  const trimmed = id?.trim()
  return trimmed || undefined
}

export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalized}`
}

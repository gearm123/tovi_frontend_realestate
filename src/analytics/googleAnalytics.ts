import { getGoogleAnalyticsId } from '../constants/seoConfig'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let analyticsInitialized = false

/**
 * Loads Google Analytics 4 when VITE_GA_MEASUREMENT_ID is set at build time.
 * Leave the env var empty until the client's GA property is ready.
 */
export function initGoogleAnalytics(): void {
  const measurementId = getGoogleAnalyticsId()
  if (!measurementId || analyticsInitialized || typeof document === 'undefined') return

  analyticsInitialized = true

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  script.setAttribute('data-managed-by', 'google-analytics')
  document.head.appendChild(script)
}

export function trackPageView(path: string, title?: string): void {
  const measurementId = getGoogleAnalyticsId()
  if (!measurementId || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    send_to: measurementId,
  })
}

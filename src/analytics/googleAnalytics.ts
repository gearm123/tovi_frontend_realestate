import { getGoogleAnalyticsId } from '../constants/seoConfig'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Google Ads account from the previous site. The Ads app counts these labels. */
const GOOGLE_ADS_ID = 'AW-984449070'
const ADS_FORM_CONVERSION = `${GOOGLE_ADS_ID}/kBdvCOSH16IZEK6AttUD`
const ADS_WHATSAPP_CONVERSION = `${GOOGLE_ADS_ID}/yInKCKf80KIZEK6AttUD`

let analyticsInitialized = false

/**
 * Loads Google Analytics 4 for G-2EY65BX3R1 and the Google Ads tag AW-984449070.
 * VITE_GA_MEASUREMENT_ID overrides the Analytics ID when set at build time.
 * The Ads tag stores the ad click so a later lead can be matched in her Ads account.
 */
export function initGoogleAnalytics(): void {
  const measurementId = getGoogleAnalyticsId()
  if (!measurementId || analyticsInitialized || typeof document === 'undefined') return

  analyticsInitialized = true

  window.dataLayer = window.dataLayer ?? []
  // gtag.js reads Arguments objects from this queue. An array is ignored.
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, { send_page_view: false })
  window.gtag('config', GOOGLE_ADS_ID)

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

function trackAdsConversion(sendTo: string): void {
  initGoogleAnalytics()
  if (!window.gtag) return

  window.gtag('event', 'conversion', { send_to: sendTo })
}

/** Contact form or lead popup submitted successfully. Counted in her Google Ads account. */
export function trackLead(): void {
  trackAdsConversion(ADS_FORM_CONVERSION)
}

/** Visitor opened WhatsApp from the floating button or a listing. Counted in her Google Ads account. */
export function trackWhatsAppClick(): void {
  trackAdsConversion(ADS_WHATSAPP_CONVERSION)
}

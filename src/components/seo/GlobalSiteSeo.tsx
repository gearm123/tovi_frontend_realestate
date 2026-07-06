import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGoogleAnalytics, trackPageView } from '../../analytics/googleAnalytics'
import { applyGlobalJsonLd } from '../../seo/applyPageMeta'
import { buildLocalBusinessJsonLd } from '../../seo/structuredData'

/** Site-wide JSON-LD and GA page-view tracking (GA loads only when env var is set). */
export default function GlobalSiteSeo() {
  const location = useLocation()

  useEffect(() => {
    initGoogleAnalytics()
    applyGlobalJsonLd('local-business', buildLocalBusinessJsonLd())
  }, [])

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`)
  }, [location.pathname, location.search])

  return null
}

/**
 * Generates public/sitemap.xml before production builds.
 * Update STATIC_PATHS or property/magazine lists when routes change.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE_URL = (process.env.VITE_SITE_URL || 'https://propertlv.com').replace(/\/+$/, '')

const STATIC_PATHS = [
  '/',
  '/about',
  '/sales',
  '/rentals',
  '/properties',
  '/services',
  '/sellers-package',
  '/contact',
  '/magazine',
]

const SALE_IDS = ['1', '2', '3', '4', '5', '6']
const RENTAL_IDS = ['r1', 'r2', 'r3', 'r4']

const MAGAZINE_SLUGS = [
  'tel-aviv-real-estate-window-2026',
  'tel-aviv-real-estate-israeli-buyers-2026',
  'bauhaus-tel-aviv',
  'neighbourhood-guide-florentin',
  'rental-market-overview',
  'video-rothschild-walkthrough',
]

function urlEntry(path) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
}

const paths = [
  ...STATIC_PATHS,
  ...SALE_IDS.map((id) => `/property/sale/${id}`),
  ...RENTAL_IDS.map((id) => `/property/rental/${id}`),
  ...MAGAZINE_SLUGS.map((slug) => `/magazine/${slug}`),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(urlEntry).join('\n')}
</urlset>
`

const outputPath = resolve('public', 'sitemap.xml')
writeFileSync(outputPath, xml, 'utf8')
console.log(`Wrote ${paths.length} URLs to ${outputPath}`)

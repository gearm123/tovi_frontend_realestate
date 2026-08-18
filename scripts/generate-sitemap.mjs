/**
 * Generates public/sitemap.xml before production builds.
 * Update STATIC_PATHS when routes change; listings come from imported inventory.
 */
import { readFileSync, writeFileSync } from 'node:fs'
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

const MAGAZINE_SLUGS = [
  'tel-aviv-real-estate-window-2026',
  'tel-aviv-real-estate-israeli-buyers-2026',
  'tova-dekkers-propertlv-themarker',
]

const listings = JSON.parse(
  readFileSync(resolve('src/data/importedListings.json'), 'utf8').replace(/^\uFEFF/, ''),
)

function urlEntry(path) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
}

const listingPaths = listings.map((property) =>
  property.listingType === 'rental'
    ? `/property/rental/${property.id}`
    : `/property/sale/${property.id}`,
)

const paths = [
  ...STATIC_PATHS,
  ...listingPaths,
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

/**
 * Pulls each listing's map pin from propertlv.com (LatLng / Google embed).
 * Falls back to Nominatim using the page address when the old site has no coords.
 *
 *   node scripts/import-listing-coordinates.mjs
 *   node scripts/import-listing-coordinates.mjs --limit=8
 *   node scripts/import-listing-coordinates.mjs --force
 *   node scripts/import-listing-coordinates.mjs --dry-run
 */
import fs from 'fs'
import path from 'path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const listingsPath = path.join(repoRoot, 'src/data/importedListings.json')
const scrapedPath = path.join(repoRoot, 'scripts/scraped-listings.json')
const cacheDir = path.join(repoRoot, 'scripts/cache')
const cachePath = path.join(cacheDir, 'listing-coordinates.json')
const geocodeCachePath = path.join(cacheDir, 'geocode-cache.json')

const ORIGIN = 'https://propertlv.com'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const NOMINATIM_UA = 'ProperTLV listing import (https://propertlv.com; office@propertlv.com)'
const PAGE_CONCURRENCY = 3
const REQUEST_GAP_MS = 150
const GEOCODE_GAP_MS = 1100

const ISRAEL_BOUNDS = { minLat: 29.4, maxLat: 33.5, minLng: 34.2, maxLng: 35.95 }

const args = new Set(process.argv.slice(2))
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 0
const FORCE = args.has('--force')
const DRY_RUN = args.has('--dry-run')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) || 1 }, () => worker())
  await Promise.all(workers)
  return results
}

function decodeSlug(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function slugFromUrl(url) {
  return decodeSlug(url.replace(/\/+$/, '').split('/').pop() || '')
}

function listingLookupKey(id) {
  return id.replace(/^r-/, '').replace(/-+$/, '')
}

function buildSlugIndex(scraped) {
  const entries = [...(scraped.rentals || []), ...(scraped.sales || [])]
    .map((item) => ({
      url: item.url,
      slug: slugFromUrl(item.url),
      title: item.title || '',
    }))
    .filter((item) => item.slug)

  function find(id) {
    const key = listingLookupKey(id)
    const exact = entries.filter(
      (item) => item.slug === id || item.slug === key || listingLookupKey(item.slug) === key,
    )
    if (exact.length === 1) return exact[0]
    const prefix = entries.filter((item) => {
      const slugKey = listingLookupKey(item.slug)
      return slugKey.startsWith(key) || key.startsWith(slugKey) || item.slug.includes(key)
    })
    if (prefix.length === 1) return prefix[0]
    if (prefix.length > 1) {
      const ranked = prefix
        .slice()
        .sort(
          (a, b) =>
            Math.abs(listingLookupKey(a.slug).length - key.length) -
            Math.abs(listingLookupKey(b.slug).length - key.length),
        )
      return ranked[0]
    }
    return null
  }

  return { entries, find }
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function roundCoord(value) {
  return Math.round(Number(value) * 1e7) / 1e7
}

function inIsrael(lat, lng) {
  return lat >= ISRAEL_BOUNDS.minLat && lat <= ISRAEL_BOUNDS.maxLat && lng >= ISRAEL_BOUNDS.minLng && lng <= ISRAEL_BOUNDS.maxLng
}

function asCoordinates(latRaw, lngRaw, source) {
  const lat = roundCoord(latRaw)
  const lng = roundCoord(lngRaw)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat === 0 && lng === 0) return null
  if (!inIsrael(lat, lng)) return null
  return { lat, lng, source }
}

function extractCoordinates(html) {
  const latLng = html.match(
    /google\.maps\.LatLng\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/i,
  )
  if (latLng) {
    const coords = asCoordinates(latLng[1], latLng[2], 'latlng')
    if (coords) return coords
  }

  const iframe = html.match(
    /maps\.google\.com\/maps\?q=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/i,
  )
  if (iframe) {
    const coords = asCoordinates(iframe[1], iframe[2], 'iframe')
    if (coords) return coords
  }

  const queryPair = html.match(/query_lat["'\s:=]+(-?\d+(?:\.\d+)?)[\s\S]{0,80}query_lng["'\s:=]+(-?\d+(?:\.\d+)?)/i)
    || html.match(/["']lat["']\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*["']lng["']\s*:\s*(-?\d+(?:\.\d+)?)/i)
  if (queryPair) {
    const coords = asCoordinates(queryPair[1], queryPair[2], 'query')
    if (coords) return coords
  }

  const jsonLd = html.match(
    /"latitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?[\s\S]{0,80}"longitude"\s*:\s*"?(-?\d+(?:\.\d+)?)"?/i,
  )
  if (jsonLd) {
    const coords = asCoordinates(jsonLd[1], jsonLd[2], 'jsonld')
    if (coords) return coords
  }

  return null
}

function extractPageAddress(html) {
  const head = html.match(/<div class="page-head"[\s\S]*?<p>([^<]+)<\/p>/i)
  if (head?.[1]) {
    const text = decodeHtml(head[1]).replace(/\s+/g, ' ').trim()
    if (text) return text
  }

  const title = html.match(/<title>([^<]+)<\/title>/i)
  if (title?.[1]) {
    const text = decodeHtml(title[1])
      .replace(/\s*[-|]\s*ProperTLV.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) return text
  }

  return ''
}

function slugToStreetHint(slug) {
  const decoded = decodeSlug(slug || '')
  if (!/\d/.test(decoded)) return ''
  return decoded.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function looksLikeStreetAddress(value) {
  if (!value || /^\d+$/.test(value)) return false
  return /\d/.test(value) && value.split(/\s+/).length <= 12
}

function geocodeQuery({ address, slug, neighborhood, title }) {
  const candidates = [address, slugToStreetHint(slug), title].map((value) =>
    String(value || '')
      .replace(/\s*[-|]\s*ProperTLV.*$/i, '')
      .replace(/\s*[|].*$/, '')
      .replace(/\s+-\s+/g, ', ')
      .replace(/\s+/g, ' ')
      .trim(),
  )
  const street = candidates.find(looksLikeStreetAddress) || candidates.find(Boolean) || ''
  if (!street) return ''

  const parts = [street]
  if (neighborhood && !street.toLowerCase().includes(neighborhood.toLowerCase())) {
    parts.push(neighborhood)
  }
  if (!/tel[\s-]?aviv|ישראל|israel|jaffa|yafo/i.test(street)) {
    parts.push('Tel Aviv', 'Israel')
  } else if (!/israel|ישראל/i.test(street)) {
    parts.push('Israel')
  }
  return parts.filter(Boolean).join(', ')
}

const FETCH_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `${ORIGIN}/`,
}

async function fetchText(url) {
  const response = await fetch(url, { headers: FETCH_HEADERS, redirect: 'follow' })
  const text = await response.text()
  return { ok: response.ok, status: response.status, url: response.url, text }
}

async function withRetry(fn, attempts = 4) {
  let lastError
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      await sleep(400 * 2 ** i)
    }
  }
  throw lastError
}

let lastGeocodeAt = 0
let geocodeChain = Promise.resolve()

function enqueueGeocode(fn) {
  const run = geocodeChain.then(fn, fn)
  geocodeChain = run.then(
    () => {},
    () => {},
  )
  return run
}

async function geocodeAddress(query, geocodeCache) {
  const key = query.toLowerCase().trim()
  if (!key) return null
  if (Object.prototype.hasOwnProperty.call(geocodeCache, key)) return geocodeCache[key]

  return enqueueGeocode(async () => {
    if (Object.prototype.hasOwnProperty.call(geocodeCache, key)) return geocodeCache[key]
    const wait = GEOCODE_GAP_MS - (Date.now() - lastGeocodeAt)
    if (wait > 0) await sleep(wait)

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'il')
  url.searchParams.set('addressdetails', '0')

  lastGeocodeAt = Date.now()
  const response = await fetch(url, {
    headers: {
      'User-Agent': NOMINATIM_UA,
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`Nominatim HTTP ${response.status}`)
  }
  const data = await response.json()
  const hit = Array.isArray(data) && data[0]
  const coords = hit ? asCoordinates(hit.lat, hit.lon, 'nominatim') : null
  const result = coords
    ? { ...coords, displayName: hit.display_name || '', query }
    : null
  geocodeCache[key] = result
  return result
  })
}

function recordFromCache(listing, cached) {
  return cached && cached.id === listing.id ? cached : null
}

async function scrapeListing(listing, slugIndex, cache, geocodeCache) {
  const cached = recordFromCache(listing, cache[listing.id])
  if (!FORCE && cached?.coordinates?.lat && cached?.coordinates?.lng) {
    return cached
  }

  const match = slugIndex.find(listing.id)
  const slug = match?.slug || listingLookupKey(listing.id)
  const pageUrl = match?.url || `${ORIGIN}/property/${encodeURI(slug)}/`

  await sleep(REQUEST_GAP_MS)
  const result = await withRetry(() => fetchText(pageUrl))
  const address = result.ok ? extractPageAddress(result.text) : match?.title || listing.title || ''
  let coords = result.ok ? extractCoordinates(result.text) : null
  let geocodeQueryUsed = ''

  if (!coords) {
    const query = geocodeQuery({
      address,
      slug,
      neighborhood: listing.neighborhood,
      title: match?.title || listing.title,
    })
    geocodeQueryUsed = query
    if (query) {
      try {
        const geo = await withRetry(() => geocodeAddress(query, geocodeCache), 3)
        if (geo) coords = geo
      } catch (error) {
        console.warn(`  geocode failed for ${listing.id}: ${error.message}`)
      }
    }
  }

  const record = {
    id: listing.id,
    pageUrl: result.url || pageUrl,
    status: result.status,
    address,
    geocodeQuery: geocodeQueryUsed || undefined,
    coordinates: coords ? { lat: coords.lat, lng: coords.lng } : null,
    source: coords?.source || (result.ok ? 'missing' : 'http'),
    fetchedAt: new Date().toISOString(),
  }
  cache[listing.id] = record
  return record
}

function uniqueCoordCount(listings) {
  return new Set(listings.map((item) => `${item.coordinates?.lat},${item.coordinates?.lng}`)).size
}

async function main() {
  ensureDir(cacheDir)

  const listings = readJson(listingsPath)
  const scraped = fs.existsSync(scrapedPath) ? readJson(scrapedPath) : { rentals: [], sales: [] }
  const slugIndex = buildSlugIndex(scraped)
  const cache = fs.existsSync(cachePath) ? readJson(cachePath) : {}
  const geocodeCache = fs.existsSync(geocodeCachePath) ? readJson(geocodeCachePath) : {}

  const targets = LIMIT > 0 ? listings.slice(0, LIMIT) : listings
  console.log(`Importing coordinates for ${targets.length} / ${listings.length} listings`)

  let done = 0
  await mapPool(targets, PAGE_CONCURRENCY, async (listing) => {
    const record = await scrapeListing(listing, slugIndex, cache, geocodeCache)
    done += 1
    if (done % 10 === 0 || done === targets.length) {
      writeJson(cachePath, cache)
      writeJson(geocodeCachePath, geocodeCache)
      const pin = record.coordinates
        ? `${record.coordinates.lat},${record.coordinates.lng} (${record.source})`
        : record.source
      console.log(`  ${done}/${targets.length}  ${listing.id}  ${pin}`)
    }
  })
  writeJson(cachePath, cache)
  writeJson(geocodeCachePath, geocodeCache)

  const withPins = targets.filter((listing) => cache[listing.id]?.coordinates)
  const fromMap = withPins.filter((listing) => ['latlng', 'iframe', 'query', 'jsonld'].includes(cache[listing.id]?.source))
  const fromGeo = withPins.filter((listing) => cache[listing.id]?.source === 'nominatim')
  const missing = targets.filter((listing) => !cache[listing.id]?.coordinates)

  console.log(
    JSON.stringify(
      {
        listings: targets.length,
        withPins: withPins.length,
        fromOldSiteMap: fromMap.length,
        fromNominatim: fromGeo.length,
        missing: missing.length,
        uniqueBefore: uniqueCoordCount(targets),
      },
      null,
      2,
    ),
  )

  if (missing.length) {
    console.log('Missing pins:')
    missing.slice(0, 25).forEach((listing) => {
      const record = cache[listing.id]
      console.log(`  - ${listing.id}  ${record?.status}  ${record?.address || listing.title}`)
    })
    if (missing.length > 25) console.log(`  … ${missing.length - 25} more`)
  }

  if (DRY_RUN) {
    console.log('Dry run — importedListings.json not written')
    return
  }

  const nextListings = listings.map((listing) => {
    const coords = cache[listing.id]?.coordinates
    if (!coords) return listing
    return {
      ...listing,
      coordinates: { lat: coords.lat, lng: coords.lng },
    }
  })
  writeJson(listingsPath, nextListings)
  console.log(`Wrote coordinates to ${path.relative(repoRoot, listingsPath)}`)
  console.log(`uniqueAfter: ${uniqueCoordCount(LIMIT > 0 ? nextListings.slice(0, LIMIT) : nextListings)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

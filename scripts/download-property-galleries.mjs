import fs from 'fs'
import path from 'path'

const repoRoot = path.resolve(import.meta.dirname, '..')
const listingsPath = path.join(repoRoot, 'src/data/importedListings.json')
const scrapedPath = path.join(repoRoot, 'scripts/scraped-listings.json')
const cacheDir = path.join(repoRoot, 'scripts/cache')
const cachePath = path.join(cacheDir, 'gallery-urls.json')
const publicRoot = path.join(repoRoot, 'public')
const galleriesRoot = path.join(publicRoot, 'assets/property_galleries')

const ORIGIN = 'https://propertlv.com'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const PAGE_CONCURRENCY = 3
const IMAGE_CONCURRENCY = 6
const MIN_IMAGE_BYTES = 4 * 1024
const REQUEST_GAP_MS = 120

const args = new Set(process.argv.slice(2))
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 0
const SKIP_DOWNLOAD = args.has('--skip-download')
const PAGES_ONLY = args.has('--pages-only')

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
      return (
        slugKey.startsWith(key) ||
        key.startsWith(slugKey) ||
        item.slug.includes(key)
      )
    })
    if (prefix.length === 1) return prefix[0]
    if (prefix.length > 1) {
      const ranked = prefix
        .slice()
        .sort((a, b) => Math.abs(listingLookupKey(a.slug).length - key.length) - Math.abs(listingLookupKey(b.slug).length - key.length))
      return ranked[0]
    }
    return null
  }

  return { entries, find }
}

function unique(values) {
  const seen = new Set()
  const out = []
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
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
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&ndash;|&mdash;/g, '—')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function extractFlexsliderHtml(html) {
  const start = html.indexOf('id="property-detail-flexslider"')
  if (start < 0) return ''
  const ulEnd = html.indexOf('</ul>', start)
  if (ulEnd < 0) return html.slice(start, start + 80_000)
  return html.slice(start, ulEnd + 5)
}

function extractSwipeboxHrefs(html) {
  const hrefs = []
  const tagRe = /<a\b[^>]*class="[^"]*swipebox[^"]*"[^>]*>/gi
  let match
  while ((match = tagRe.exec(html))) {
    const href = match[0].match(/href="([^"]+)"/i)?.[1]
    if (href) hrefs.push(decodeHtml(href))
  }
  return hrefs
}

function normalizeImageUrl(url) {
  if (!url) return ''
  let next = decodeHtml(url).trim()
  if (next.startsWith('//')) next = `https:${next}`
  if (next.startsWith('/')) next = `${ORIGIN}${next}`
  next = next.replace(/^http:\/\//i, 'https://')
  return next.split('?')[0]
}

function isUploadUrl(url) {
  return /\/wp-content\/uploads\//i.test(url)
}

function extractGalleryUrls(html, fallbackUrl) {
  const flex = extractFlexsliderHtml(html)
  const fromFlex = extractSwipeboxHrefs(flex).map(normalizeImageUrl).filter(isUploadUrl)
  if (fromFlex.length > 0) return unique(fromFlex)

  const featuredStart = html.indexOf('id="property-featured-image"')
  if (featuredStart >= 0) {
    const featured = extractSwipeboxHrefs(html.slice(featuredStart, featuredStart + 2500))
      .map(normalizeImageUrl)
      .filter(isUploadUrl)
    if (featured.length > 0) return unique(featured)
  }

  const fallback = normalizeImageUrl(fallbackUrl)
  return fallback && isUploadUrl(fallback) ? [fallback] : []
}

function htmlToText(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\u00a0/g, ' '),
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractDescription(html) {
  const match = html.match(/<div class="content clearfix">([\s\S]*?)<\/div>/i)
  if (!match) return ''
  return htmlToText(match[1])
}

function extractFeatures(html) {
  const block = html.match(/<ul class="arrow-bullet-list[\s\S]*?<\/ul>/i)?.[0] || ''
  return [...block.matchAll(/<li[^>]*>[\s\S]*?<\/li>/gi)].map((item) =>
    htmlToText(item[0]).trim(),
  )
}

function mergeFeatures(existing, names) {
  const haystack = names.join(' ').toLowerCase()
  const has = (...needles) => needles.some((needle) => haystack.includes(needle))
  return {
    balcony: existing.balcony || has('balcony', 'terrace', 'patio'),
    parking: existing.parking || has('parking'),
    elevator: existing.elevator || has('elevator', 'lift'),
    mamad: existing.mamad || has('mamad', 'safe room'),
    miklat: existing.miklat || has('miklat', 'shelter'),
    petsAllowed: existing.petsAllowed || has('pets allowed', 'pet friendly'),
  }
}

function extensionFromUrlOrType(url, contentType) {
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase()
  if (fromUrl && fromUrl.length <= 5) return fromUrl
  if (contentType?.includes('png')) return '.png'
  if (contentType?.includes('webp')) return '.webp'
  if (contentType?.includes('gif')) return '.gif'
  return '.jpg'
}

function localGalleryDir(listingId) {
  return path.join(galleriesRoot, listingId)
}

function localPublicPath(listingId, filename) {
  return `/assets/property_galleries/${listingId}/${filename}`
}

const FETCH_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `${ORIGIN}/`,
}

async function fetchText(url) {
  const response = await fetch(url, { headers: FETCH_HEADERS, redirect: 'follow' })
  const text = await response.text()
  return { ok: response.ok, status: response.status, url: response.url, text }
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      ...FETCH_HEADERS,
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  return { buffer, contentType: response.headers.get('content-type') || '' }
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

async function scrapeListingPage(listing, slugIndex, cache) {
  const cached = cache[listing.id]
  if (cached?.images?.length) return cached

  const match = slugIndex.find(listing.id)
  const slug = match?.slug || listingLookupKey(listing.id)
  const pageUrl = match?.url || `${ORIGIN}/property/${encodeURI(slug)}/`

  await sleep(REQUEST_GAP_MS)
  const result = await withRetry(() => fetchText(pageUrl))
  if (!result.ok) {
    const fallback = listing.image ? [normalizeImageUrl(listing.image)] : []
    const record = {
      id: listing.id,
      pageUrl,
      status: result.status,
      images: fallback.filter(Boolean),
      description: listing.description,
      features: [],
    }
    cache[listing.id] = record
    return record
  }

  const images = extractGalleryUrls(result.text, listing.image)
  const description = extractDescription(result.text)
  const features = extractFeatures(result.text)
  const record = {
    id: listing.id,
    pageUrl: result.url || pageUrl,
    status: result.status,
    images,
    description,
    features,
  }
  cache[listing.id] = record
  return record
}

async function downloadImage(url, destWithoutExt) {
  const existing = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    .map((ext) => `${destWithoutExt}${ext}`)
    .find((file) => fs.existsSync(file) && fs.statSync(file).size >= MIN_IMAGE_BYTES)
  if (existing) return existing

  const { buffer, contentType } = await withRetry(() => fetchBuffer(url))
  if (buffer.length < MIN_IMAGE_BYTES) {
    throw new Error(`image too small (${buffer.length} bytes): ${url}`)
  }
  const ext = extensionFromUrlOrType(url, contentType)
  const dest = `${destWithoutExt}${ext}`
  const tmp = `${dest}.part`
  fs.writeFileSync(tmp, buffer)
  fs.renameSync(tmp, dest)
  return dest
}

async function materializeGallery(listing, record) {
  if (!record.images.length) {
    return { paths: listing.image ? [listing.image] : [], downloaded: 0, failed: 0 }
  }

  if (SKIP_DOWNLOAD || PAGES_ONLY) {
    return { paths: record.images, downloaded: 0, failed: 0 }
  }

  const dir = localGalleryDir(listing.id)
  ensureDir(dir)

  let downloaded = 0
  let failed = 0
  const paths = []

  await mapPool(record.images, IMAGE_CONCURRENCY, async (url, index) => {
    const destBase = path.join(dir, String(index + 1).padStart(2, '0'))
    try {
      const dest = await downloadImage(url, destBase)
      const relative = `/${path.relative(publicRoot, dest).replaceAll('\\', '/')}`
      paths[index] = relative
      downloaded += 1
    } catch (error) {
      failed += 1
      paths[index] = url
      console.warn(`  ! ${listing.id} image ${index + 1}: ${error.message}`)
    }
  })

  return { paths: paths.filter(Boolean), downloaded, failed }
}

function applyRecord(listing, record, localPaths) {
  const images = localPaths.length > 0 ? localPaths : listing.image ? [listing.image] : []
  const next = { ...listing }
  if (images.length > 0) {
    next.images = images
    next.image = images[0]
  }
  if (record.description && record.description.length > (listing.description || '').length) {
    next.description = record.description
  }
  if (record.features?.length) {
    next.features = mergeFeatures(listing.features || {}, record.features)
  }
  return next
}

async function main() {
  ensureDir(cacheDir)
  ensureDir(galleriesRoot)

  const listings = readJson(listingsPath)
  const scraped = fs.existsSync(scrapedPath) ? readJson(scrapedPath) : { rentals: [], sales: [] }
  const slugIndex = buildSlugIndex(scraped)
  const cache = fs.existsSync(cachePath) ? readJson(cachePath) : {}

  const targets = LIMIT > 0 ? listings.slice(0, LIMIT) : listings
  console.log(`Scraping galleries for ${targets.length} / ${listings.length} listings`)

  let scrapedCount = 0
  await mapPool(targets, PAGE_CONCURRENCY, async (listing) => {
    const record = await scrapeListingPage(listing, slugIndex, cache)
    scrapedCount += 1
    if (scrapedCount % 10 === 0 || scrapedCount === targets.length) {
      writeJson(cachePath, cache)
      console.log(`  pages ${scrapedCount}/${targets.length} (last ${listing.id}: ${record.images.length} photos)`)
    }
  })
  writeJson(cachePath, cache)

  if (PAGES_ONLY) {
    const photoCounts = targets.map((listing) => cache[listing.id]?.images?.length || 0)
    console.log(
      JSON.stringify(
        {
          listings: targets.length,
          withGallery: photoCounts.filter((n) => n > 1).length,
          withOne: photoCounts.filter((n) => n === 1).length,
          withNone: photoCounts.filter((n) => n === 0).length,
          photos: photoCounts.reduce((sum, n) => sum + n, 0),
        },
        null,
        2,
      ),
    )
    return
  }

  let downloaded = 0
  let failed = 0
  const updatedById = new Map()

  for (const [index, listing] of targets.entries()) {
    const record = cache[listing.id]
    const result = await materializeGallery(listing, record)
    downloaded += result.downloaded
    failed += result.failed
    updatedById.set(listing.id, applyRecord(listing, record, result.paths))
    if ((index + 1) % 10 === 0 || index + 1 === targets.length) {
      console.log(`  images ${index + 1}/${targets.length} (saved ${downloaded}, failed ${failed})`)
    }
  }

  const nextListings = listings.map((listing) => updatedById.get(listing.id) || listing)
  writeJson(listingsPath, nextListings)

  const localGalleries = nextListings.filter((listing) =>
    (listing.images || []).some((src) => src.startsWith('/assets/property_galleries/')),
  )
  const photoCounts = nextListings.map((listing) => (listing.images || []).length)

  console.log(
    JSON.stringify(
      {
        listings: nextListings.length,
        localGalleries: localGalleries.length,
        photos: photoCounts.reduce((sum, n) => sum + n, 0),
        multiPhoto: photoCounts.filter((n) => n > 1).length,
        downloaded,
        failed,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

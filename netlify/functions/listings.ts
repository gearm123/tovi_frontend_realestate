import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { getDatabase } from '@netlify/database'
import type { Config } from '@netlify/functions'
import { agents as seedAgents, DEFAULT_AGENT_ID } from '../../src/data/agents'
import { business as seedBusiness } from '../../src/data/business'
import seedListings from '../../src/data/importedListings.json'
import { leadCapturePopupConfig } from '../../src/config/leadCapturePopup'
import type { Agent } from '../../src/types/agent'
import type { BusinessContact } from '../../src/types/business'
import type { ListingLocaleCopy, Property } from '../../src/types/property'
import { withCleanedListingCopy } from '../../src/utils/listingCopy'
import { withNormalizedPropertyImages } from '../../src/utils/propertyGallery'
import { withoutStreetNumbers } from '../../src/utils/streetNumber'
import {
  isListingAvailable,
  listingAvailability,
} from '../../src/utils/listingAvailability'
import {
  assignPropertyCodes,
  existingListingMessage,
  findExistingListing,
  nextPropertyCode,
  normalizePropertyCode,
} from '../../src/utils/propertyCode'
import { adminPassword, adminUsername } from './credentials'
import {
  publicCatalogHeaders,
  purgePublicCatalog,
  readPublicCatalog,
  writePublicCatalog,
} from './publicCatalogCache'
import {
  listingNeedsTranslation,
  withListingTranslations,
  type ListingLocale,
} from './translateListing'
import {
  ArticleInputError,
  deleteArticle,
  ensureArticlesSeeded,
  listArticles,
  upsertArticle,
} from './magazineStore'
import type { MagazineArticle, MagazineLocaleCopy } from '../../src/types/magazine'
import { RUSSIAN_ARTICLE_REPAIRS } from '../../src/data/magazine/russianArticleRepairs'
import { restoreStoredProjectNames } from '../../src/utils/protectedProjectNames'
import { applyMamadTermsAcross, type MamadLocale } from '../../src/utils/mamadTerms'
import { articleRedirectMap } from '../../src/utils/articleRedirects'
import {
  deleteFailedLead,
  FailedLeadInputError,
  insertFailedLead,
  listFailedLeads,
} from './failedLeads'
import type { FailedLead } from '../../src/types/failedLead'

const IMAGE_STORE = 'listing-images'
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const seed = seedListings as Property[]
let seedPromise: Promise<void> | null = null
let settingsSeedPromise: Promise<void> | null = null

interface SiteContent {
  agents: Agent[]
  business: BusinessContact
  leadCapture: {
    enabled: boolean
    rule: { mode: 'all' } | { mode: 'include' | 'exclude'; paths: string[] }
    delayMs: number
    appearances: number
    recipientEmail: string
  }
  defaultAgentId: string
}

const seedSettings: SiteContent = {
  agents: seedAgents,
  business: seedBusiness,
  leadCapture: {
    enabled: leadCapturePopupConfig.enabled,
    rule: leadCapturePopupConfig.rule,
    delayMs: leadCapturePopupConfig.delayMs,
    appearances: leadCapturePopupConfig.appearances,
    recipientEmail: leadCapturePopupConfig.recipientEmail,
  },
  defaultAgentId: DEFAULT_AGENT_ID,
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const pathname = requestPath(url, req)
  const method = req.method.toUpperCase()

  try {
    if (pathname === '/api/admin/session' && method === 'POST') {
      return await createSession(req)
    }

    if (pathname === '/api/listing-images' && method === 'POST') {
      const denied = requireAdmin(req)
      if (denied) return denied
      return await uploadImage(req)
    }

    if (pathname.startsWith('/api/listing-images/')) {
      if (method !== 'GET' && method !== 'HEAD') return json(405, { error: 'Method not allowed' })
      return await readImage(pathname.slice('/api/listing-images/'.length), method === 'HEAD')
    }

    if (pathname === '/api/catalog-version' && method === 'GET') {
      return await readCatalogVersion(req)
    }

    if (pathname === '/api/site' && method === 'GET') {
      return await readSettings(req)
    }

    if (pathname === '/api/site' && method === 'PUT') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureSettingsSeeded()
      return await writeSettings(req)
    }

    if (pathname === '/api/listings' && method === 'GET') {
      if (verifyToken(readBearer(req))) {
        await ensureSeeded()
        return await listListings(req)
      }
      return await readPublicListings(req)
    }

    if (pathname === '/api/listings' && method === 'PUT') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureSeeded()
      return await upsertListing(req)
    }

    if (pathname === '/api/listings/translate' && method === 'POST') {
      await ensureSeeded()
      return await translateMissingListings(req)
    }

    if (pathname.startsWith('/api/listings/') && method === 'DELETE') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureSeeded()
      return await removeListing(decodeURIComponent(pathname.slice('/api/listings/'.length)))
    }

    if (pathname === '/api/articles' && method === 'GET') {
      return await readPublicArticles(req)
    }

    if (pathname === '/api/articles' && method === 'PUT') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureArticlesSeeded()
      const body = (await req.json().catch(() => null)) as { article?: MagazineArticle } | null
      if (!body?.article) return json(400, { error: 'An article is required.' })
      try {
        const saved = await upsertArticle(body.article)
        await publishArticlesCatalog()
        return json(200, saved)
      } catch (error) {
        if (error instanceof ArticleInputError) return json(400, { error: error.message })
        throw error
      }
    }

    if (pathname.startsWith('/api/articles/') && method === 'DELETE') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureArticlesSeeded()
      const id = decodeURIComponent(pathname.slice('/api/articles/'.length))
      try {
        const removed = await deleteArticle(id)
        if (!removed) return json(404, { error: 'Article not found.' })
        await publishArticlesCatalog()
      } catch (error) {
        if (error instanceof ArticleInputError) return json(400, { error: error.message })
        throw error
      }
      return json(200, { ok: true })
    }

    if (pathname === '/api/failed-leads' && method === 'GET') {
      const denied = requireAdmin(req)
      if (denied) return denied
      return json(200, { leads: await listFailedLeads() })
    }

    if (pathname === '/api/failed-leads' && method === 'POST') {
      const body = (await req.json().catch(() => null)) as { lead?: Partial<FailedLead> } | null
      if (!body?.lead) return json(400, { error: 'A lead is required.' })
      try {
        const lead = await insertFailedLead(body.lead)
        return json(200, { lead })
      } catch (error) {
        if (error instanceof FailedLeadInputError) return json(400, { error: error.message })
        throw error
      }
    }

    if (pathname.startsWith('/api/failed-leads/') && method === 'DELETE') {
      const denied = requireAdmin(req)
      if (denied) return denied
      const id = decodeURIComponent(pathname.slice('/api/failed-leads/'.length))
      try {
        const removed = await deleteFailedLead(id)
        if (!removed) return json(404, { error: 'Lead not found.' })
      } catch (error) {
        if (error instanceof FailedLeadInputError) return json(400, { error: error.message })
        throw error
      }
      return json(200, { ok: true })
    }

    return json(404, { error: 'Not found' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Listings request failed'
    console.error(message)
    return json(500, { error: 'The listings database is unavailable. Try again in a moment.' })
  }
}

export const config: Config = {
  path: '/api/*',
}

function requestPath(url: URL, req: Request): string {
  if (!url.pathname.startsWith('/.netlify/functions/')) return url.pathname
  const original =
    req.headers.get('x-nf-request-path') ||
    req.headers.get('x-forwarded-uri') ||
    req.headers.get('x-netlify-original-pathname')
  if (!original) return url.pathname
  const path = original.split('?')[0]
  return path.startsWith('/') ? path : `/${path}`
}

function json(status: number, body: unknown, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...Object.fromEntries(new Headers(extraHeaders).entries()),
    },
  })
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function signToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + 14 * 24 * 60 * 60 * 1000 }),
  ).toString('base64url')
  const signature = createHmac('sha256', adminPassword()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function verifyToken(token: string | null): boolean {
  if (!token) return false
  const splitAt = token.lastIndexOf('.')
  if (splitAt <= 0) return false
  const payload = token.slice(0, splitAt)
  const signature = token.slice(splitAt + 1)
  const expected = createHmac('sha256', adminPassword()).update(payload).digest('base64url')
  if (!safeEqual(signature, expected)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u?: string
      exp?: number
    }
    return data.u === adminUsername() && typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

function readBearer(req: Request): string | null {
  const header = req.headers.get('authorization') ?? ''
  const match = header.match(/^Bearer\s+(\S+)$/i)
  return match?.[1] ?? null
}

function requireAdmin(req: Request): Response | null {
  if (verifyToken(readBearer(req))) return null
  return json(401, { error: 'Sign in again to publish listings.' })
}

async function createSession(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { username?: string; password?: string } | null
  const username = body?.username?.trim() ?? ''
  const password = body?.password ?? ''
  if (!safeEqual(username, adminUsername()) || !safeEqual(password, adminPassword())) {
    return json(401, { error: 'Invalid username or password.' })
  }
  return json(200, { token: signToken(username) })
}

async function database() {
  return getDatabase()
}

async function ensureSeeded(): Promise<void> {
  if (!seedPromise) seedPromise = seedIfEmpty().catch((error) => {
    seedPromise = null
    throw error
  })
  await seedPromise
}

async function seedIfEmpty(): Promise<void> {
  const db = await database()
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(742001)')
    const count = await client.query<{ count: number }>('SELECT COUNT(*)::int AS count FROM listings')
    if ((count.rows[0]?.count ?? 0) > 0) {
      await client.query('COMMIT')
      return
    }

    const rows = assignPropertyCodes(seed.map((property) => normalizeListing(property))).map(
      (property, index) => ({
        id: property.id,
        data: property,
        sort_index: index,
      }),
    )
    await client.query(
      `INSERT INTO listings (id, data, sort_index)
       SELECT id, data, sort_index
       FROM jsonb_to_recordset($1::jsonb) AS x(id text, data jsonb, sort_index bigint)
       ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(rows)],
    )
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function ensureSettingsSeeded(): Promise<void> {
  if (!settingsSeedPromise) {
    settingsSeedPromise = seedSettingsIfEmpty().catch((error) => {
      settingsSeedPromise = null
      throw error
    })
  }
  await settingsSeedPromise
}

async function seedSettingsIfEmpty(): Promise<void> {
  const db = await database()
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(742002)')
    const existing = await client.query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM site_content WHERE id = 'settings'`,
    )
    if ((existing.rows[0]?.count ?? 0) === 0) {
      await client.query(
        `INSERT INTO site_content (id, data) VALUES ('settings', $1::jsonb) ON CONFLICT (id) DO NOTHING`,
        [JSON.stringify(seedSettings)],
      )
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

function publishedStamp(entry: { savedAt: number; body: unknown }): number {
  if (entry.body && typeof entry.body === 'object' && typeof (entry.body as { savedAt?: unknown }).savedAt === 'number') {
    return (entry.body as { savedAt: number }).savedAt
  }
  return entry.savedAt
}

async function staticCatalogVersion(req: Request): Promise<{ listings: number; articles: number; settings: number }> {
  try {
    const response = await fetch(new URL('/catalog/version.json', req.url))
    if (!response.ok) return { listings: 0, articles: 0, settings: 0 }
    const body = (await response.json()) as { listings?: unknown; articles?: unknown; settings?: unknown }
    return {
      listings: typeof body.listings === 'number' ? body.listings : 0,
      articles: typeof body.articles === 'number' ? body.articles : 0,
      settings: typeof body.settings === 'number' ? body.settings : 0,
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not read the published catalog version')
    return { listings: 0, articles: 0, settings: 0 }
  }
}

async function readCatalogVersion(req: Request): Promise<Response> {
  const fallback = await staticCatalogVersion(req)
  const [listingsEntry, articlesEntry, settingsEntry] = await Promise.all([
    readPublicCatalog<{ savedAt?: number }>('listings'),
    readPublicCatalog<{ savedAt?: number }>('articles'),
    readPublicCatalog<{ savedAt?: number }>('settings'),
  ])
  const listings = listingsEntry ? publishedStamp(listingsEntry) : fallback.listings
  const articles = articlesEntry ? publishedStamp(articlesEntry) : fallback.articles
  const settings = settingsEntry ? publishedStamp(settingsEntry) : fallback.settings
  return json(
    200,
    { listings, articles, settings },
    publicCatalogHeaders('catalog-version', Math.max(listings, articles, settings)),
  )
}

async function readStaticCatalog(req: Request, name: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(new URL(`/catalog/${name}.json`, req.url))
    if (!response.ok) return null
    const body = (await response.json()) as Record<string, unknown>
    return body && typeof body === 'object' ? body : null
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not read the published catalog file')
    return null
  }
}

async function servePublishedCatalog(
  req: Request,
  name: string,
  ready: (body: Record<string, unknown>) => boolean,
  varyAuthorization = false,
): Promise<Response> {
  const cached = await readPublicCatalog<Record<string, unknown>>(name)
  if (cached && ready(cached.body)) {
    return json(200, cached.body, publicCatalogHeaders(name, publishedStamp(cached), varyAuthorization))
  }
  const snapshot = await readStaticCatalog(req, name)
  if (snapshot && ready(snapshot)) {
    await writePublicCatalog(name, snapshot)
    const savedAt = typeof snapshot.savedAt === 'number' ? snapshot.savedAt : 0
    return json(200, snapshot, publicCatalogHeaders(name, savedAt, varyAuthorization))
  }
  return json(503, { error: 'The catalog is not available yet.' })
}

async function readSettings(req: Request): Promise<Response> {
  return servePublishedCatalog(req, 'settings', (body) => Boolean(body.settings))
}

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false
  const content = value as SiteContent
  return (
    Array.isArray(content.agents) &&
    content.agents.every((agent) => typeof agent?.id === 'string' && agent.id.trim().length > 0) &&
    Boolean(content.business && typeof content.business === 'object') &&
    Boolean(content.leadCapture && typeof content.leadCapture === 'object') &&
    typeof content.defaultAgentId === 'string' &&
    content.defaultAgentId.trim().length > 0
  )
}

async function writeSettings(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { settings?: SiteContent } | null
  if (!isSiteContent(body?.settings)) {
    return json(400, { error: 'Site settings are incomplete.' })
  }
  const settings = body.settings
  const db = await database()
  await db.pool.query(
    `INSERT INTO site_content (id, data, updated_at)
     VALUES ('settings', $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(settings)],
  )
  const savedAt = Date.now()
  await writePublicCatalog('settings', { savedAt, settings })
  await purgePublicCatalog('settings')
  return json(200, { settings })
}

async function readListings(): Promise<Property[]> {
  const db = await database()
  const result = await db.pool.query<{ data: Property }>(
    'SELECT data FROM listings ORDER BY sort_index ASC, id ASC',
  )
  return result.rows.map((row) => row.data)
}

async function ensurePropertyCodes(): Promise<Property[]> {
  const current = await readListings()
  if (current.every((listing) => normalizePropertyCode(listing.propertyCode ?? ''))) return current

  const db = await database()
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(742003)')
    const locked = await client.query<{ data: Property }>(
      'SELECT data FROM listings ORDER BY sort_index ASC, id ASC',
    )
    const rows = locked.rows.map((row) => row.data)
    const assigned = assignPropertyCodes(rows)
    for (let index = 0; index < assigned.length; index += 1) {
      if ((rows[index]?.propertyCode ?? '') === assigned[index].propertyCode) continue
      await client.query(
        'UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1',
        [assigned[index].id, JSON.stringify(assigned[index])],
      )
    }
    await client.query('COMMIT')
    return assigned
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function listListings(req: Request): Promise<Response> {
  const listings = await ensurePropertyCodes()
  const visible = verifyToken(readBearer(req))
    ? listings
    : listings.filter(isListingAvailable).map(forPublicListing)
  return json(200, { listings: visible })
}

function galleryTail(images: string[] | undefined): string {
  return (images ?? []).slice(1).join('\n')
}

/** The saved catalog copy must keep each listing's original cover and gallery. */
async function alignListingPhotosOnce(req: Request): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('listing-photo-align-v1')
  if (marker?.body?.done) return
  try {
    const snapshot = await readStaticCatalog(req, 'listings')
    const snapshotListings = Array.isArray(snapshot?.listings) ? (snapshot.listings as Property[]) : []
    const previousById = new Map(snapshotListings.map((listing) => [listing.id, listing]))
    const current = await readListings()
    const db = await database()
    let restored = 0
    for (const listing of current) {
      const previous = previousById.get(listing.id)
      const previousImages = previous?.images ?? []
      if (!previous || previousImages.length === 0) continue
      const currentImages = listing.images ?? []
      const sameGallery =
        listing.image === previous.image && JSON.stringify(currentImages) === JSON.stringify(previousImages)
      if (sameGallery) continue
      if (galleryTail(currentImages) !== galleryTail(previousImages)) continue
      const next = {
        ...listing,
        image: previous.image || previousImages[0],
        images: previousImages,
      }
      await db.pool.query('UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        listing.id,
        JSON.stringify(next),
      ])
      restored += 1
    }
    const { listings } = await publicListingsBody()
    await writePublicCatalog('listings', { savedAt: Date.now(), listings })
    await purgePublicCatalog('listings')
    await writePublicCatalog('listing-photo-align-v1', { done: true, savedAt: Date.now(), restored })
    if (restored > 0) console.log(`Restored original photos on ${restored} listings`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not align the catalog photos')
  }
}

async function readPublicListings(req: Request): Promise<Response> {
  await alignListingPhotosOnce(req)
  await repairProjectNamesOnce()
  await repairAddedProjectNamesOnce()
  await repairMamadTermsOnce()
  await refreshWeizmannTranslationOnce()
  return servePublishedCatalog(req, 'listings', (body) => Array.isArray(body.listings), true)
}

async function publicListingsBody(): Promise<{ listings: Property[] }> {
  const listings = (await ensurePropertyCodes()).filter(isListingAvailable).map(forPublicListing)
  return { listings }
}

async function publishListingsCatalog(): Promise<void> {
  try {
    const { listings } = await publicListingsBody()
    await writePublicCatalog('listings', { savedAt: Date.now(), listings })
    await purgePublicCatalog('listings')
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not refresh the public listings')
  }
}

function russianCopyReady(copy: MagazineLocaleCopy | undefined): boolean {
  if (!copy?.title || !copy.body?.length) return false
  const sample = [copy.title, copy.excerpt, ...copy.body.slice(0, 3)].join(' ')
  const cyrillic = (sample.match(/[\u0400-\u04FF]/g) ?? []).length
  const latin = (sample.match(/[A-Za-z]/g) ?? []).length
  return cyrillic > latin
}

/** Replace Russian copies that are still the English text. Runs once. */
async function repairRussianArticlesOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('article-ru-repair-v1')
  if (marker?.body?.done) return
  try {
    const articles = await listArticles()
    const db = await database()
    let updated = 0
    for (const article of articles) {
      const russian = RUSSIAN_ARTICLE_REPAIRS[article.id]
      if (!russian || russianCopyReady(article.translations?.ru)) continue
      const next: MagazineArticle = {
        ...article,
        translations: { ...article.translations, ru: russian },
      }
      await db.pool.query('UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        article.id,
        JSON.stringify(next),
      ])
      updated += 1
    }
    if (updated > 0) await publishArticlesCatalog()
    await writePublicCatalog('article-ru-repair-v1', { done: true, savedAt: Date.now(), updated })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not repair the Russian articles')
  }
}

async function readPublicArticles(req: Request): Promise<Response> {
  await repairRussianArticlesOnce()
  await repairProjectNamesOnce()
  await repairAddedProjectNamesOnce()
  await repairMamadTermsOnce()
  await repairAssutaSlugOnce()
  return servePublishedCatalog(req, 'articles', (body) => Array.isArray(body.articles))
}

function rewriteStoredText(text: string | undefined, locale: 'he' | 'fr' | 'ru'): string {
  return restoreStoredProjectNames(text ?? '', locale)
}

function rewriteStoredLines(lines: string[] | undefined, locale: 'he' | 'fr' | 'ru'): string[] | undefined {
  if (!lines) return lines
  return lines.map((line) => rewriteStoredText(line, locale))
}

function rewriteMagazineCopy(copy: MagazineLocaleCopy, locale: 'he' | 'fr' | 'ru'): MagazineLocaleCopy {
  return {
    ...copy,
    category: rewriteStoredText(copy.category, locale),
    title: rewriteStoredText(copy.title, locale),
    excerpt: rewriteStoredText(copy.excerpt, locale),
    date: rewriteStoredText(copy.date, locale),
    body: (copy.body ?? []).map((paragraph) => rewriteStoredText(paragraph, locale)),
    captions: rewriteStoredLines(copy.captions, locale),
    source: copy.source
      ? {
          ...copy.source,
          name: rewriteStoredText(copy.source.name, locale),
          credit: rewriteStoredText(copy.source.credit, locale),
        }
      : copy.source,
  }
}

function rewriteListingCopy(copy: ListingLocaleCopy, locale: 'he' | 'fr' | 'ru'): ListingLocaleCopy {
  return {
    ...copy,
    title: rewriteStoredText(copy.title, locale),
    address: rewriteStoredText(copy.address, locale),
    description: rewriteStoredText(copy.description, locale),
    highlights: rewriteStoredLines(copy.highlights, locale),
    specialNotes: rewriteStoredLines(copy.specialNotes, locale),
  }
}

/** Puts protected project names back into French and Russian copies. Runs once. */
async function repairProjectNamesOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('project-name-repair-v1')
  if (marker?.body?.done) return
  try {
    const db = await database()
    let articlesUpdated = 0
    let listingsUpdated = 0
    for (const article of await listArticles()) {
      const french = article.translations?.fr
      const russian = article.translations?.ru
      if (!french && !russian) continue
      const next: MagazineArticle = {
        ...article,
        translations: {
          ...article.translations,
          ...(french ? { fr: rewriteMagazineCopy(french, 'fr') } : {}),
          ...(russian ? { ru: rewriteMagazineCopy(russian, 'ru') } : {}),
        },
      }
      if (JSON.stringify(next.translations) === JSON.stringify(article.translations)) continue
      await db.pool.query('UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        article.id,
        JSON.stringify(next),
      ])
      articlesUpdated += 1
    }
    for (const listing of await readListings()) {
      const french = listing.translations?.fr
      const russian = listing.translations?.ru
      if (!french && !russian) continue
      const next: Property = {
        ...listing,
        translations: {
          ...listing.translations,
          ...(french ? { fr: rewriteListingCopy(french, 'fr') } : {}),
          ...(russian ? { ru: rewriteListingCopy(russian, 'ru') } : {}),
        },
      }
      if (JSON.stringify(next.translations) === JSON.stringify(listing.translations)) continue
      await db.pool.query('UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        listing.id,
        JSON.stringify(next),
      ])
      listingsUpdated += 1
    }
    if (articlesUpdated > 0) await publishArticlesCatalog()
    if (listingsUpdated > 0) await publishListingsCatalog()
    await writePublicCatalog('project-name-repair-v1', {
      done: true,
      savedAt: Date.now(),
      articlesUpdated,
      listingsUpdated,
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not restore project names')
  }
}

/** Restores ProperTLV, Mandarin Oriental, Gindi, Sarona, and the other protected spellings. Runs once. */
async function repairAddedProjectNamesOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('project-name-repair-v2')
  if (marker?.body?.done) return
  try {
    const db = await database()
    const locales = ['he', 'fr', 'ru'] as const
    let articlesUpdated = 0
    let listingsUpdated = 0
    for (const article of await listArticles()) {
      const translations = { ...article.translations }
      let changed = false
      for (const locale of locales) {
        const copy = translations[locale]
        if (!copy) continue
        const nextCopy = rewriteMagazineCopy(copy, locale)
        if (JSON.stringify(nextCopy) === JSON.stringify(copy)) continue
        translations[locale] = nextCopy
        changed = true
      }
      if (!changed) continue
      const next: MagazineArticle = { ...article, translations }
      await db.pool.query('UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        article.id,
        JSON.stringify(next),
      ])
      articlesUpdated += 1
    }
    for (const listing of await readListings()) {
      const translations = { ...listing.translations }
      let changed = false
      for (const locale of locales) {
        const copy = translations[locale]
        if (!copy) continue
        const nextCopy = rewriteListingCopy(copy, locale)
        if (JSON.stringify(nextCopy) === JSON.stringify(copy)) continue
        translations[locale] = nextCopy
        changed = true
      }
      if (!changed) continue
      const next: Property = { ...listing, translations }
      await db.pool.query('UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        listing.id,
        JSON.stringify(next),
      ])
      listingsUpdated += 1
    }
    if (articlesUpdated > 0) await publishArticlesCatalog()
    if (listingsUpdated > 0) await publishListingsCatalog()
    await writePublicCatalog('project-name-repair-v2', {
      done: true,
      savedAt: Date.now(),
      articlesUpdated,
      listingsUpdated,
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not restore the added project names')
  }
}

const MAMAD_LOCALES = ['en', 'he', 'fr', 'ru'] as const

function rewriteListingMamadCopy(copy: ListingLocaleCopy, locale: MamadLocale): ListingLocaleCopy {
  const highlights = copy.highlights ?? []
  const notes = copy.specialNotes ?? []
  const [title, address, description, ...rest] = applyMamadTermsAcross(
    [copy.title ?? '', copy.address ?? '', copy.description ?? '', ...highlights, ...notes],
    locale,
  )
  return {
    ...copy,
    title,
    address,
    description,
    highlights: rest.slice(0, highlights.length),
    specialNotes: rest.slice(highlights.length),
  }
}

function rewriteArticleMamadCopy(copy: MagazineLocaleCopy, locale: MamadLocale): MagazineLocaleCopy {
  const body = copy.body ?? []
  const captions = copy.captions ?? []
  const [title, excerpt, ...rest] = applyMamadTermsAcross(
    [copy.title ?? '', copy.excerpt ?? '', ...body, ...captions],
    locale,
  )
  return {
    ...copy,
    title,
    excerpt,
    body: rest.slice(0, body.length),
    captions: captions.length ? rest.slice(body.length) : copy.captions,
  }
}

/** Makes safe-room wording match the language rules. Runs once. */
async function repairMamadTermsOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('mamad-term-repair-v1')
  if (marker?.body?.done) return
  try {
    const db = await database()
    let articlesUpdated = 0
    let listingsUpdated = 0
    for (const article of await listArticles()) {
      const [title, excerpt, ...body] = applyMamadTermsAcross(
        [article.title ?? '', article.excerpt ?? '', ...(article.body ?? [])],
        'en',
      )
      const translations = { ...article.translations }
      let translationsChanged = false
      for (const locale of MAMAD_LOCALES) {
        const copy = translations[locale]
        if (!copy) continue
        const nextCopy = rewriteArticleMamadCopy(copy, locale)
        if (JSON.stringify(nextCopy) === JSON.stringify(copy)) continue
        translations[locale] = nextCopy
        translationsChanged = true
      }
      const hebrew = article.hebrew ? rewriteArticleMamadCopy(article.hebrew, 'he') : article.hebrew
      const next: MagazineArticle = {
        ...article,
        title,
        excerpt,
        body,
        hebrew,
        translations: translationsChanged ? translations : article.translations,
      }
      if (JSON.stringify(next) === JSON.stringify(article)) continue
      await db.pool.query('UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        article.id,
        JSON.stringify(next),
      ])
      articlesUpdated += 1
    }
    for (const listing of await readListings()) {
      const highlightSource = listing.highlights ?? []
      const noteSource = listing.specialNotes ?? []
      const [title, description, ...rest] = applyMamadTermsAcross(
        [listing.title ?? '', listing.description ?? '', ...highlightSource, ...noteSource],
        'en',
      )
      const translations = { ...listing.translations }
      let translationsChanged = false
      for (const locale of MAMAD_LOCALES) {
        const copy = translations[locale]
        if (!copy) continue
        const nextCopy = rewriteListingMamadCopy(copy, locale)
        if (JSON.stringify(nextCopy) === JSON.stringify(copy)) continue
        translations[locale] = nextCopy
        translationsChanged = true
      }
      const he = listing.he ? rewriteListingMamadCopy(listing.he, 'he') : listing.he
      const next: Property = {
        ...listing,
        title,
        description,
        highlights: listing.highlights ? rest.slice(0, highlightSource.length) : listing.highlights,
        specialNotes: listing.specialNotes ? rest.slice(highlightSource.length) : listing.specialNotes,
        he,
        translations: translationsChanged ? translations : listing.translations,
      }
      if (JSON.stringify(next) === JSON.stringify(listing)) continue
      await db.pool.query('UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        listing.id,
        JSON.stringify(next),
      ])
      listingsUpdated += 1
    }
    if (articlesUpdated > 0) await publishArticlesCatalog()
    if (listingsUpdated > 0) await publishListingsCatalog()
    await writePublicCatalog('mamad-term-repair-v1', {
      done: true,
      savedAt: Date.now(),
      articlesUpdated,
      listingsUpdated,
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not normalize safe-room wording')
  }
}

async function publishArticlesCatalog(): Promise<void> {
  try {
    const articles = await listArticles()
    await writePublicCatalog('articles', { savedAt: Date.now(), articles })
    await writePublicCatalog('article-redirects', articleRedirectMap(articles))
    await purgePublicCatalog('articles')
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not refresh the public articles')
  }
}

const ASSUTA_ARTICLE_ID = 'mag-1791920858356'
const ASSUTA_OLD_SLUG = 'assuta-bauhaus-village-guide'
const ASSUTA_SLUG = 'assuta-village'

/** Moves the Assuta article off the bauhaus address and keeps that address as a redirect. */
async function repairAssutaSlugOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('article-slug-repair-v1')
  if (marker?.body?.done) return
  try {
    const articles = await listArticles()
    const article = articles.find((item) => item.id === ASSUTA_ARTICLE_ID)
    const taken = articles.some((item) => item.id !== ASSUTA_ARTICLE_ID && item.slug === ASSUTA_SLUG)
    if (article && article.slug === ASSUTA_OLD_SLUG && !taken) {
      const previousSlugs = [...new Set([...(article.previousSlugs ?? []), article.slug])].filter(
        (slug) => slug !== ASSUTA_SLUG,
      )
      const next: MagazineArticle = { ...article, slug: ASSUTA_SLUG, previousSlugs }
      const db = await database()
      await db.pool.query('UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
        article.id,
        JSON.stringify(next),
      ])
      await publishArticlesCatalog()
    }
    await writePublicCatalog('article-slug-repair-v1', { done: true, savedAt: Date.now() })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not update the Assuta article address')
  }
}

function textLines(lines: string[] | undefined): string[] {
  return (lines ?? []).map((line) => line.trim()).filter(Boolean)
}

function englishListingCopy(listing: Property): ListingLocaleCopy {
  return {
    title: listing.title,
    address: listing.address,
    description: listing.description ?? '',
    highlights: listing.highlights,
    specialNotes: listing.specialNotes,
  }
}

function listingCopyChanged(next: Property, current: Property): boolean {
  return (
    (next.title ?? '').trim() !== (current.title ?? '').trim() ||
    (next.address ?? '').trim() !== (current.address ?? '').trim() ||
    (next.description ?? '').trim() !== (current.description ?? '').trim() ||
    JSON.stringify(textLines(next.highlights)) !== JSON.stringify(textLines(current.highlights)) ||
    JSON.stringify(textLines(next.specialNotes)) !== JSON.stringify(textLines(current.specialNotes))
  )
}

/** Rewrites Hebrew, French, and Russian from the English listing text. */
async function refreshListingLanguages(listing: Property, he?: Property['he']): Promise<Property> {
  const translated = await withListingTranslations(listing, ['he', 'fr', 'ru'])
  return {
    ...listing,
    translations: {
      ...listing.translations,
      ...translated.translations,
      en: englishListingCopy(listing),
    },
    he: he ?? listing.he,
  }
}

/** Retranslates Weizmann 23 once, because its older translations stayed after the English edit. */
async function refreshWeizmannTranslationOnce(): Promise<void> {
  const marker = await readPublicCatalog<{ done?: boolean }>('listing-translation-refresh-pt-1023')
  if (marker?.body?.done) return
  try {
    const listing = (await readListings()).find(
      (item) => normalizePropertyCode(item.propertyCode ?? '') === 'PT-1023',
    )
    if (!listing) {
      await writePublicCatalog('listing-translation-refresh-pt-1023', {
        done: true,
        savedAt: Date.now(),
        missing: true,
      })
      return
    }
    const next = await refreshListingLanguages(listing)
    const db = await database()
    await db.pool.query('UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1', [
      listing.id,
      JSON.stringify(next),
    ])
    await publishListingsCatalog()
    await writePublicCatalog('listing-translation-refresh-pt-1023', {
      done: true,
      savedAt: Date.now(),
      id: listing.id,
    })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not refresh the Weizmann listing')
  }
}

async function upsertListing(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { listing?: Property } | null
  const incoming = body?.listing
  if (!incoming || typeof incoming.id !== 'string' || !isListingId(incoming.id)) {
    return json(400, { error: 'A valid listing id is required.' })
  }
  if (!incoming.title?.trim() || !incoming.address?.trim()) {
    return json(400, { error: 'Title and address are required.' })
  }
  if (incoming.listingType !== 'sale' && incoming.listingType !== 'rental') {
    return json(400, { error: 'Listing type must be sale or rental.' })
  }

  const normalized = normalizeListing(incoming)
  const listings = await ensurePropertyCodes()
  if (!normalized.propertyCode) normalized.propertyCode = nextPropertyCode(listings)
  const duplicate = findExistingListing(normalized, listings)
  if (duplicate) return json(409, { error: existingListingMessage(duplicate) })

  const prepared = await storeEmbeddedImages(normalized)
  const db = await database()
  const existing = await db.pool.query<{ data: Property }>(
    'SELECT data FROM listings WHERE id = $1',
    [prepared.id],
  )
  const current = existing.rows[0]?.data
  let listing = prepared
  if (!current) {
    try {
      listing = await withListingTranslations(prepared)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Listing translation failed')
      return json(502, { error: 'The listing could not be translated. Publish it again in a moment.' })
    }
  } else if (listingCopyChanged(prepared, current)) {
    try {
      listing = await refreshListingLanguages(prepared, current.he)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Listing translation failed')
      return json(502, { error: 'The listing could not be translated. Publish it again in a moment.' })
    }
  } else {
    const missing = (['he', 'fr', 'ru'] as const).filter((locale) => !current.translations?.[locale])
    let filled: Property['translations']
    if (missing.length) {
      try {
        filled = (await withListingTranslations(prepared, missing)).translations
      } catch (error) {
        console.error(error instanceof Error ? error.message : 'Listing translation failed')
      }
    }
    listing = {
      ...prepared,
      translations: {
        ...filled,
        ...current.translations,
        en: englishListingCopy(prepared),
      },
      he: current.he ?? prepared.he,
    }
  }
  await db.pool.query(
    `INSERT INTO listings (id, data, sort_index, updated_at)
     VALUES ($1, $2::jsonb, $3, now())
     ON CONFLICT (id) DO UPDATE
       SET data = EXCLUDED.data, updated_at = now()`,
    [listing.id, JSON.stringify(listing), -Date.now()],
  )
  await publishListingsCatalog()
  return json(200, { listing })
}

async function translateMissingListings(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { locale?: string; limit?: number } | null
  const locale = body?.locale
  if (!isListingLocale(locale)) return json(400, { error: 'A site language is required.' })
  const limit = Math.min(4, Math.max(1, Number(body?.limit) || 3))

  const db = await database()
  const result = await db.pool.query<{ data: Property }>(
    'SELECT data FROM listings ORDER BY sort_index ASC, id ASC',
  )
  const missing = result.rows
    .map((row) => row.data)
    .filter((listing) => listingNeedsTranslation(listing, locale))
  const updated: Property[] = []

  for (const current of missing.slice(0, limit)) {
    try {
      const translated = await withListingTranslations(current, [locale])
      const copy = translated.translations?.[locale]
      if (!copy) continue
      const listing: Property = {
        ...current,
        translations: { ...current.translations, [locale]: copy },
        he: current.he,
      }
      await db.pool.query(
        'UPDATE listings SET data = $2::jsonb, updated_at = now() WHERE id = $1',
        [listing.id, JSON.stringify(listing)],
      )
      updated.push(listing)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Listing translation failed')
      break
    }
  }

  if (updated.length > 0) await publishListingsCatalog()

  return json(200, {
    listings: updated.map(forPublicListing),
    remaining: Math.max(0, missing.length - updated.length),
  })
}

function isListingLocale(value: string | undefined): value is ListingLocale {
  return value === 'en' || value === 'he' || value === 'fr' || value === 'ru'
}

async function removeListing(id: string): Promise<Response> {
  if (!isListingId(id)) return json(400, { error: 'A valid listing id is required.' })
  const db = await database()
  const result = await db.pool.query('DELETE FROM listings WHERE id = $1', [id])
  if ((result.rowCount ?? 0) === 0) return json(404, { error: 'Listing not found.' })
  await publishListingsCatalog()
  return json(200, { ok: true })
}

function forPublicListing(listing: Property): Property {
  if (!listing.ownerPhone && !listing.fullAddress) return listing
  const next = { ...listing }
  delete next.ownerPhone
  delete next.fullAddress
  return next
}

function isListingId(id: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/.test(id)
}

function normalizeListing(property: Property): Property {
  const images = (property.images ?? []).map((src) => src.trim()).filter(Boolean)
  return withNormalizedPropertyImages(
    withoutStreetNumbers(
      withCleanedListingCopy({
        ...property,
        id: property.id.trim(),
        images,
        image: images[0] || property.image,
        videoUrl: property.videoUrl?.trim() || undefined,
        availability: listingAvailability(property),
        propertyCode: normalizePropertyCode(property.propertyCode ?? '') || undefined,
        ownerPhone: property.ownerPhone?.trim() || undefined,
        fullAddress: property.fullAddress?.trim() || undefined,
      }),
    ),
  )
}

async function storeEmbeddedImages(property: Property): Promise<Property> {
  const images: string[] = []
  for (const src of property.images ?? []) {
    if (src.startsWith('data:')) images.push(await storeDataUrl(src))
    else images.push(src)
  }
  return withNormalizedPropertyImages({ ...property, images, image: images[0] ?? property.image })
}

async function storeDataUrl(value: string): Promise<string> {
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=\s]+)$/)
  if (!match) throw new Error('Unsupported embedded image')
  const contentType = match[1].toLowerCase()
  const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64')
  return storeBytes(contentType, bytes)
}

async function uploadImage(req: Request): Promise<Response> {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return json(400, { error: 'Choose an image file to upload.' })
  const contentType = file.type.toLowerCase()
  if (!IMAGE_TYPES[contentType]) return json(400, { error: 'Upload a JPEG, PNG, WebP, or GIF image.' })
  if (file.size > MAX_IMAGE_BYTES) return json(400, { error: 'Each photo must be 8 MB or smaller.' })
  const bytes = Buffer.from(await file.arrayBuffer())
  const url = await storeBytes(contentType, bytes)
  return json(200, { url })
}

async function storeBytes(contentType: string, bytes: Buffer): Promise<string> {
  const extension = IMAGE_TYPES[contentType]
  if (!extension) throw new Error('Unsupported image type')
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error('Image is too large')
  const key = `${randomUUID()}.${extension}`
  const store = getStore(IMAGE_STORE)
  await store.set(key, bytes, { metadata: { contentType } })
  return `/api/listing-images/${key}`
}

async function readImage(rawKey: string, head: boolean): Promise<Response> {
  const key = decodeURIComponent(rawKey)
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/.test(key)) return json(404, { error: 'Image not found' })
  const store = getStore(IMAGE_STORE)
  const stored = await store.getWithMetadata(key, { type: 'arrayBuffer' })
  if (!stored?.data) return json(404, { error: 'Image not found' })
  const contentType =
    typeof stored.metadata.contentType === 'string' ? stored.metadata.contentType : 'application/octet-stream'
  return new Response(head ? null : stored.data, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}

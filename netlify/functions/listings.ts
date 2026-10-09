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
import type { Property } from '../../src/types/property'
import { withCleanedListingCopy } from '../../src/utils/listingCopy'
import { withNormalizedPropertyImages } from '../../src/utils/propertyGallery'
import { withoutStreetNumbers } from '../../src/utils/streetNumber'
import {
  isListingAvailable,
  listingAvailability,
} from '../../src/utils/listingAvailability'
import { adminPassword, adminUsername } from './credentials'
import {
  listingNeedsTranslation,
  withListingTranslations,
  type ListingLocale,
} from './translateListing'

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

    if (pathname === '/api/site' && method === 'GET') {
      await ensureSettingsSeeded()
      return await readSettings()
    }

    if (pathname === '/api/site' && method === 'PUT') {
      const denied = requireAdmin(req)
      if (denied) return denied
      await ensureSettingsSeeded()
      return await writeSettings(req)
    }

    if (pathname === '/api/listings' && method === 'GET') {
      await ensureSeeded()
      return await listListings(req)
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

    const rows = seed.map((property, index) => ({
      id: property.id,
      data: normalizeListing(property),
      sort_index: index,
    }))
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

async function readSettings(): Promise<Response> {
  const db = await database()
  const result = await db.pool.query<{ data: SiteContent }>(
    `SELECT data FROM site_content WHERE id = 'settings'`,
  )
  const settings = result.rows[0]?.data
  if (!settings) return json(404, { error: 'Site settings are not available yet.' })
  return json(200, { settings })
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
  return json(200, { settings })
}

async function listListings(req: Request): Promise<Response> {
  const db = await database()
  const result = await db.pool.query<{ data: Property }>(
    'SELECT data FROM listings ORDER BY sort_index ASC, id ASC',
  )
  const listings = result.rows.map((row) => row.data)
  const visible = verifyToken(readBearer(req)) ? listings : listings.filter(isListingAvailable)
  return json(200, { listings: visible })
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

  const prepared = await storeEmbeddedImages(normalizeListing(incoming))
  const db = await database()
  const existing = await db.pool.query<{ data: Property }>(
    'SELECT data FROM listings WHERE id = $1',
    [prepared.id],
  )
  const current = existing.rows[0]?.data
  let listing = prepared
  if (!current || listingCopyChanged(current, prepared)) {
    try {
      listing = await withListingTranslations(prepared)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Listing translation failed')
      return json(502, { error: 'The listing could not be translated. Publish it again in a moment.' })
    }
  }
  await db.pool.query(
    `INSERT INTO listings (id, data, sort_index, updated_at)
     VALUES ($1, $2::jsonb, $3, now())
     ON CONFLICT (id) DO UPDATE
       SET data = EXCLUDED.data, updated_at = now()`,
    [listing.id, JSON.stringify(listing), -Date.now()],
  )
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
      const listing = await withListingTranslations(current)
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

  return json(200, {
    listings: updated,
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
  return json(200, { ok: true })
}

function listingCopyChanged(current: Property, next: Property): boolean {
  const copy = (property: Property) =>
    JSON.stringify({
      title: property.title,
      address: property.address,
      description: property.description,
      highlights: property.highlights ?? [],
      specialNotes: property.specialNotes ?? [],
    })
  return copy(current) !== copy(next)
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

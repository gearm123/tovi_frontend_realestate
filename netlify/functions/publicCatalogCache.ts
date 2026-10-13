import { getStore } from '@netlify/blobs'
import { purgeCache } from '@netlify/functions'

const STORE = 'catalog-cache'
const MAX_AGE_MS = 24 * 60 * 60 * 1000
const EDGE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

interface Snapshot<T> {
  savedAt: number
  body: T
}

export interface PublicCatalog<T> {
  savedAt: number
  body: T
}

function catalogStore() {
  return getStore({ name: STORE, consistency: 'strong' })
}

/** Public pages read this instead of Postgres, so the database can stay asleep. */
export async function readPublicCatalog<T>(key: string): Promise<PublicCatalog<T> | null> {
  try {
    const snapshot = (await catalogStore().get(key, { type: 'json' })) as Snapshot<T> | null
    if (!snapshot || typeof snapshot.savedAt !== 'number' || snapshot.body == null) return null
    if (Date.now() - snapshot.savedAt > MAX_AGE_MS) return null
    return { savedAt: snapshot.savedAt, body: snapshot.body }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not read the public catalog cache')
    return null
  }
}

export async function writePublicCatalog<T>(key: string, body: T): Promise<number> {
  const savedAt = Date.now()
  const snapshot: Snapshot<T> = { savedAt, body }
  try {
    await catalogStore().setJSON(key, snapshot)
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not update the public catalog cache')
  }
  return savedAt
}

/** Drop the edge copy after a publish so the next visit rebuilds it. */
export async function purgePublicCatalog(tag: string): Promise<void> {
  try {
    await purgeCache({ tags: [tag] })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not refresh the public catalog')
  }
}

export function publicCatalogHeaders(tag: string, savedAt: number): HeadersInit {
  return {
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': `public, durable, s-maxage=${EDGE_MAX_AGE_SECONDS}, must-revalidate`,
    'netlify-cache-tag': tag,
    'netlify-vary': 'header=Authorization',
    etag: `"${tag}-${savedAt}"`,
  }
}

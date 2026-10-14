import { getStore } from '@netlify/blobs'
import { purgeCache } from '@netlify/functions'

const STORE = 'catalog-cache'
const EDGE_MAX_AGE_SECONDS = 60 * 60 * 24

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

/** Visitors read this copy instead of Postgres, so the database can stay asleep. */
export async function readPublicCatalog<T>(key: string): Promise<PublicCatalog<T> | null> {
  try {
    const snapshot = (await catalogStore().get(key, { type: 'json' })) as Snapshot<T> | null
    if (!snapshot || typeof snapshot.savedAt !== 'number' || snapshot.body == null) return null
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
    try {
      await catalogStore().setJSON(key, snapshot)
    } catch (retryError) {
      console.error(retryError instanceof Error ? retryError.message : 'Could not update the public catalog cache')
    }
  }
  return savedAt
}

/** Drop the edge copy after a publish so the next visit reads the updated catalog. */
export async function purgePublicCatalog(tag: string): Promise<void> {
  try {
    await purgeCache({ tags: [tag, 'catalog-version'] })
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not refresh the public catalog')
  }
}

export function publicCatalogHeaders(tag: string, savedAt: number, varyAuthorization = false): HeadersInit {
  const headers: Record<string, string> = {
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': `public, durable, s-maxage=${EDGE_MAX_AGE_SECONDS}, must-revalidate`,
    'netlify-cache-tag': tag,
    etag: `"${tag}-${savedAt}"`,
  }
  if (varyAuthorization) headers['netlify-vary'] = 'header=Authorization'
  return headers
}

import { getStore } from '@netlify/blobs'

const STORE = 'catalog-cache'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

interface Snapshot<T> {
  savedAt: number
  body: T
}

function catalogStore() {
  return getStore({ name: STORE, consistency: 'strong' })
}

/** Public pages read this instead of Postgres, so the database can stay asleep. */
export async function readPublicCatalog<T>(key: string): Promise<T | null> {
  try {
    const snapshot = (await catalogStore().get(key, { type: 'json' })) as Snapshot<T> | null
    if (!snapshot || typeof snapshot.savedAt !== 'number' || snapshot.body == null) return null
    if (Date.now() - snapshot.savedAt > MAX_AGE_MS) return null
    return snapshot.body
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not read the public catalog cache')
    return null
  }
}

export async function writePublicCatalog<T>(key: string, body: T): Promise<void> {
  const snapshot: Snapshot<T> = { savedAt: Date.now(), body }
  try {
    await catalogStore().setJSON(key, snapshot)
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not update the public catalog cache')
  }
}

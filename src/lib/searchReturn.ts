const STORAGE_KEY = 'propertlv-search-return'

export interface SearchReturn {
  path: string
  scroll: number
  visible: number
  view: 'list' | 'map'
}

export function rememberSearchReturn(place: SearchReturn) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(place))
  } catch {
    /* ignore */
  }
}

export function readSearchReturn(path: string): SearchReturn | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SearchReturn
    if (parsed.path !== path || !Number.isFinite(parsed.scroll)) return null
    return parsed
  } catch {
    return null
  }
}

export function clearSearchReturn() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

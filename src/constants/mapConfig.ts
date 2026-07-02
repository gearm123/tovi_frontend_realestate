import { PLACEHOLDER_MAP_CENTER } from '../data/placeholders'
import type { MapBounds, MapProvider, MapViewport } from '../types/map'

/**
 * Map integration settings.
 *
 * REAL MAP INTEGRATION — add keys via environment variables (never commit secrets):
 *   VITE_MAP_PROVIDER=google|mapbox
 *   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
 *   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
 *
 * Then install the provider SDK and implement the matching component in
 * src/components/map/providers/ (see mapService.getActiveMapProvider).
 */
export const MAP_CONFIG = {
  /** Switch to 'google' or 'mapbox' once API credentials are configured */
  provider: (import.meta.env.VITE_MAP_PROVIDER ?? 'placeholder') as MapProvider,
  defaultViewport: {
    center: PLACEHOLDER_MAP_CENTER,
    zoom: 13,
  } satisfies MapViewport,
  /** Tel Aviv viewport for placeholder pin projection */
  telAvivBounds: {
    south: 32.045,
    west: 34.745,
    north: 32.125,
    east: 34.82,
  } satisfies MapBounds,
} as const

export function getMapCredentials() {
  return {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined,
    mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined,
  }
}

export function isLiveMapConfigured(): boolean {
  const { provider } = MAP_CONFIG
  const { googleMapsApiKey, mapboxAccessToken } = getMapCredentials()

  if (provider === 'google') return Boolean(googleMapsApiKey)
  if (provider === 'mapbox') return Boolean(mapboxAccessToken)
  return false
}

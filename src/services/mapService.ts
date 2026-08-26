import { MAP_CONFIG, isLiveMapConfigured } from '../constants/mapConfig'
import { NEIGHBORHOOD_COORDINATES } from '../data/neighborhoodCoordinates'
import { PLACEHOLDER_MAP_CENTER } from '../data/placeholders'
import type {
  MapBounds,
  MapPinPositionSource,
  MapPointPercent,
  MapProvider,
  PropertyMapPin,
} from '../types/map'
import type { Property, PropertyCoordinates } from '../types/property'
import { getPropertyDetailPath } from '../utils/propertyPath'

function hasValidCoordinates(coords: PropertyCoordinates): boolean {
  return (
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lng) &&
    !(coords.lat === 0 && coords.lng === 0)
  )
}

/** Small deterministic offset so multiple listings in one neighborhood do not stack */
function pinOffset(propertyId: string): PropertyCoordinates {
  const hash = [...propertyId].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const angle = ((hash % 360) * Math.PI) / 180
  const radius = 0.0025 + (hash % 4) * 0.0008

  return {
    lat: Math.sin(angle) * radius,
    lng: Math.cos(angle) * radius,
  }
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

function coordinateKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`
}

/**
 * Listings often share the same scraped/placeholder coordinates, which makes
 * Google Maps draw a single pin. Fan those stacks out so every listing is visible.
 */
export function spreadStackedPins(pins: PropertyMapPin[]): PropertyMapPin[] {
  if (pins.length < 2) return pins

  const groups = new Map<string, number[]>()
  pins.forEach((pin, index) => {
    const key = coordinateKey(pin.lat, pin.lng)
    const group = groups.get(key)
    if (group) group.push(index)
    else groups.set(key, [index])
  })

  const next = pins.slice()
  groups.forEach((indices) => {
    if (indices.length < 2) return

    const spacing = indices.length > 8 ? 0.0018 : 0.00018
    indices.forEach((pinIndex, i) => {
      if (i === 0) return
      const pin = next[pinIndex]
      if (!pin) return
      const radius = spacing * Math.sqrt(i)
      const angle = i * GOLDEN_ANGLE
      next[pinIndex] = {
        ...pin,
        lat: pin.lat + Math.sin(angle) * radius,
        lng: pin.lng + Math.cos(angle) * radius,
      }
    })
  })

  return next
}

export function resolvePropertyMapPosition(
  property: Property,
): { lat: number; lng: number; positionSource: MapPinPositionSource } {
  if (hasValidCoordinates(property.coordinates)) {
    return {
      lat: property.coordinates.lat,
      lng: property.coordinates.lng,
      positionSource: 'coordinates',
    }
  }

  const neighborhoodCenter =
    NEIGHBORHOOD_COORDINATES[property.neighborhood] ?? PLACEHOLDER_MAP_CENTER
  const offset = pinOffset(property.id)

  return {
    lat: neighborhoodCenter.lat + offset.lat,
    lng: neighborhoodCenter.lng + offset.lng,
    positionSource: 'neighborhood',
  }
}

export function latLngToMapPercent(
  lat: number,
  lng: number,
  bounds: MapBounds = MAP_CONFIG.telAvivBounds,
): MapPointPercent {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100

  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(94, Math.max(6, y)),
  }
}

export function buildPropertyMapPins(properties: Property[]): PropertyMapPin[] {
  const pins = properties.map((property) => {
    const position = resolvePropertyMapPosition(property)

    return {
      id: property.id,
      title: property.title,
      address: property.address,
      neighborhood: property.neighborhood,
      listingType: property.listingType,
      price: property.price,
      area: property.area,
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      image: property.image,
      lat: position.lat,
      lng: position.lng,
      positionSource: position.positionSource,
      href: getPropertyDetailPath(property),
    }
  })

  return spreadStackedPins(pins)
}

function uniquePinCoordinates(pins: Array<{ lat: number; lng: number }>): PropertyCoordinates[] {
  const seen = new Set<string>()
  const unique: PropertyCoordinates[] = []
  for (const pin of pins) {
    const key = `${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push({ lat: pin.lat, lng: pin.lng })
  }
  return unique
}

function mapsZoomForPins(pins: PropertyCoordinates[]): number {
  if (pins.length <= 1) return 16
  const lats = pins.map((pin) => pin.lat)
  const lngs = pins.map((pin) => pin.lng)
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs))
  if (span < 0.008) return 16
  if (span < 0.02) return 15
  if (span < 0.05) return 14
  if (span < 0.1) return 13
  return 12
}

/** Opens Google Maps with a dropped pin at the exact coordinates. */
export function getExternalMapsUrl(lat: number, lng: number, zoom = 16): string {
  const latLng = `${lat.toFixed(6)},${lng.toFixed(6)}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(latLng)}`
}

/** Google Maps URL covering one listing pin, or the area of several pins. */
export function getExternalMapsUrlForPins(pins: Array<{ lat: number; lng: number }>): string {
  const unique = uniquePinCoordinates(pins)
  if (unique.length === 0) {
    return getExternalMapsUrl(PLACEHOLDER_MAP_CENTER.lat, PLACEHOLDER_MAP_CENTER.lng, 13)
  }
  if (unique.length === 1) {
    return getExternalMapsUrl(unique[0].lat, unique[0].lng, 16)
  }

  const path = unique.map((pin) => `${pin.lat.toFixed(6)},${pin.lng.toFixed(6)}`)
  const dirUrl = `https://www.google.com/maps/dir/${path.join('/')}`
  if (dirUrl.length <= 1800) return dirUrl

  const centerLat = unique.reduce((sum, pin) => sum + pin.lat, 0) / unique.length
  const centerLng = unique.reduce((sum, pin) => sum + pin.lng, 0) / unique.length
  const zoom = mapsZoomForPins(unique)
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${centerLat.toFixed(6)},${centerLng.toFixed(6)}&zoom=${zoom}`
}

export function openExternalMaps(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function getActiveMapProvider(): MapProvider {
  const { provider } = MAP_CONFIG
  if ((provider === 'google' || provider === 'mapbox') && isLiveMapConfigured()) {
    return provider
  }
  return 'placeholder'
}

/**
 * Future Google Maps / Mapbox entry points.
 * Implement these when VITE_* credentials are configured (see constants/mapConfig.ts).
 */
export function createLiveMapLoader(provider: Exclude<MapProvider, 'placeholder'>) {
  if (provider === 'google') {
  // return () => import('./mapProviders/googleMaps')
  }

  if (provider === 'mapbox') {
  // return () => import('./mapProviders/mapboxMap')
  }

  return null
}

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
  return properties.map((property) => {
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
}

export function getExternalMapsUrl(lat: number, lng: number, label?: string): string {
  const query = label?.trim()
    ? `${lat},${lng} (${label.trim()})`
    : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
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

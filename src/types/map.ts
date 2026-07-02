import type { PropertyCoordinates } from './property'

export type MapProvider = 'placeholder' | 'google' | 'mapbox'

export type MapPinPositionSource = 'coordinates' | 'neighborhood'

export interface MapBounds {
  south: number
  west: number
  north: number
  east: number
}

export interface MapViewport {
  center: PropertyCoordinates
  zoom: number
}

export interface PropertyMapPin {
  id: string
  title: string
  neighborhood: string
  listingType: 'sale' | 'rental'
  price: string
  lat: number
  lng: number
  positionSource: MapPinPositionSource
  href: string
}

export interface MapPointPercent {
  x: number
  y: number
}

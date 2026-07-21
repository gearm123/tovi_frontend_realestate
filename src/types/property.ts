export type ListingType = 'sale' | 'rental'

/** Sale or rent — alias used in content briefs; maps to listingType in data */
export type PropertyStatus = ListingType

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'penthouse'
  | 'duplex'
  | 'loft'

export interface PropertyCoordinates {
  lat: number
  lng: number
}

export interface PropertyFeatures {
  balcony: boolean
  parking: boolean
  elevator: boolean
  mamad: boolean
  miklat: boolean
  petsAllowed: boolean
}

export interface Property {
  id: string
  title: string
  neighborhood: string
  address: string
  price: string
  priceNumeric: number
  /** sale | rental */
  listingType: ListingType
  propertyType: PropertyType
  /** Total rooms (Israeli convention — includes living room) */
  rooms: number
  bedrooms: number
  bathrooms: number
  area: number
  /** Short listing description */
  description: string
  /**
   * Cover / primary image — used on cards, SEO, and as gallery fallback.
   * Prefer keeping this in sync with `images[0]`.
   */
  image: string
  /**
   * Photo gallery for the listing detail page (horizontal scroll).
   * When empty/missing, the UI falls back to `[image]`.
   */
  images?: string[]
  /** Optional property tour — empty until client provides video */
  videoUrl?: string
  /** Map pin — placeholder coordinates until exact address is confirmed */
  coordinates: PropertyCoordinates
  featured?: boolean
  features: PropertyFeatures
  /** Agent responsible for this listing — references `agents.ts` */
  agentId: string
}

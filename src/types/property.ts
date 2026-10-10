export type ListingType = 'sale' | 'rental'

/** Whether a listing is on the public site. Sold and rented stay in admin only. */
export type ListingAvailability = 'available' | 'sold' | 'rented'

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

export type ListingLocale = 'en' | 'he' | 'fr' | 'ru'

/** Listing text in one site language. */
export interface ListingLocaleCopy {
  title: string
  address: string
  description: string
  highlights?: string[]
  specialNotes?: string[]
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
  /**
   * Public visibility. Missing means available.
   * Sold and rented listings remain in the admin panel and leave the website.
   */
  availability?: ListingAvailability
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
  /** Map pin — scraped from the listing page when available */
  coordinates: PropertyCoordinates
  /** Floor label, e.g. "3", "Ground", or "5 of 8" */
  floor?: string
  /** Bullet highlights shown on the listing page */
  highlights?: string[]
  /** Special notes such as TAMA, off-market, or urban renewal */
  specialNotes?: string[]
  featured?: boolean
  exclusive?: boolean
  isNew?: boolean
  features: PropertyFeatures
  /** Agent responsible for this listing — references `agents.ts` */
  agentId: string
  /** Short public id such as PT-1001. Unique across listings. */
  propertyCode?: string
  /** Owner phone for the office. Stored with the listing and omitted from the public site. */
  ownerPhone?: string
  /** Listing text translated for each site language. */
  translations?: Partial<Record<ListingLocale, ListingLocaleCopy>>
  /** Older Hebrew copy. Automatic translations replace this when present. */
  he?: ListingLocaleCopy
}

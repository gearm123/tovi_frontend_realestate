export type ListingType = 'sale' | 'rental'

export type PropertyType =
  | 'apartment'
  | 'house'
  | 'penthouse'
  | 'duplex'
  | 'loft'

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
  listingType: ListingType
  propertyType: PropertyType
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  image: string
  featured?: boolean
  features: PropertyFeatures
}

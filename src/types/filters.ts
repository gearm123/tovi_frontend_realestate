import type { PropertyType } from './property'

export interface PropertyFilters {
  neighborhood: string
  propertyType: PropertyType | ''
  priceMin: number
  priceMax: number
  bedrooms: number | ''
  balcony: boolean
  parking: boolean
  elevator: boolean
  mamad: boolean
  miklat: boolean
  petsAllowed: boolean
}

export const defaultFilters: PropertyFilters = {
  neighborhood: '',
  propertyType: '',
  priceMin: 0,
  priceMax: 20000000,
  bedrooms: '',
  balcony: false,
  parking: false,
  elevator: false,
  mamad: false,
  miklat: false,
  petsAllowed: false,
}

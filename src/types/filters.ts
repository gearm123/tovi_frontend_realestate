import type { ListingStatusFilter } from '../constants/propertySearch'
import { getPriceMaxForStatus, SALE_PRICE_MAX } from '../constants/propertySearch'
import type { PropertyType } from './property'

export interface PropertyFilters {
  listingStatus: ListingStatusFilter
  neighborhood: string
  propertyType: PropertyType | ''
  priceMin: number
  priceMax: number
  /** Minimum total rooms (Israeli convention) */
  rooms: number | ''
  balcony: boolean
  parking: boolean
  elevator: boolean
  mamad: boolean
  miklat: boolean
  petsAllowed: boolean
}

export function createDefaultFilters(
  listingStatus: ListingStatusFilter = 'all',
): PropertyFilters {
  return {
    listingStatus,
    neighborhood: '',
    propertyType: '',
    priceMin: 0,
    priceMax: getPriceMaxForStatus(listingStatus),
    rooms: '',
    balcony: false,
    parking: false,
    elevator: false,
    mamad: false,
    miklat: false,
    petsAllowed: false,
  }
}

/** @deprecated use createDefaultFilters — kept for imports that expect a static default */
export const defaultFilters: PropertyFilters = createDefaultFilters('all')

export { SALE_PRICE_MAX }

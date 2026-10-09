import type { ListingAvailability, ListingType, Property } from '../types/property'

export function isListingAvailable(property: Pick<Property, 'availability'>): boolean {
  return property.availability !== 'sold' && property.availability !== 'rented'
}

/** Closed listings use sold for sales and rented for rentals. */
export function listingAvailability(
  property: Pick<Property, 'availability' | 'listingType'>,
): ListingAvailability {
  if (isListingAvailable(property)) return 'available'
  return property.listingType === 'rental' ? 'rented' : 'sold'
}

export function closedListingAvailability(
  listingType: ListingType,
): Exclude<ListingAvailability, 'available'> {
  return listingType === 'rental' ? 'rented' : 'sold'
}

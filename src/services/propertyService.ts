import { getSiteData } from '../lib/siteDataStore'
import type { Property } from '../types/property'
import { isListingAvailable } from '../utils/listingAvailability'

export { neighborhoods, propertyTypes } from '../data/properties'

/**
 * Property data access layer.
 * Reads from the site data store (seeded from static data, editable in admin).
 */
export function getAllProperties(): Property[] {
  return getSiteData().properties.filter(isListingAvailable)
}

export function getPropertiesByListingType(
  listingType: Property['listingType'],
): Property[] {
  return getAllProperties().filter((p) => p.listingType === listingType)
}

export function getPropertyById(id: string): Property | undefined {
  return getAllProperties().find((p) => p.id === id)
}

export function getFeaturedProperties(): Property[] {
  return getAllProperties().filter((p) => p.featured)
}

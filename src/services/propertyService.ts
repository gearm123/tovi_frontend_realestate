import { getSiteData } from '../lib/siteDataStore'
import type { Property } from '../types/property'

export { neighborhoods, propertyTypes } from '../data/properties'

/**
 * Property data access layer.
 * Reads from the site data store (seeded from static data, editable in admin).
 */
export function getAllProperties(): Property[] {
  return getSiteData().properties
}

export function getPropertiesByListingType(
  listingType: Property['listingType'],
): Property[] {
  return getSiteData().properties.filter((p) => p.listingType === listingType)
}

export function getPropertyById(id: string): Property | undefined {
  return getSiteData().properties.find((p) => p.id === id)
}

export function getFeaturedProperties(): Property[] {
  return getSiteData().properties.filter((p) => p.featured)
}

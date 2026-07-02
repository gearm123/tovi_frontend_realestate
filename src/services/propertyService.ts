import { properties } from '../data/properties'
import type { Property } from '../types/property'

export { neighborhoods, propertyTypes } from '../data/properties'

/**
 * Property data access layer.
 * Replace these functions with API/CRM calls when ready.
 */
export function getAllProperties(): Property[] {
  return properties
}

export function getPropertiesByListingType(
  listingType: Property['listingType'],
): Property[] {
  return properties.filter((p) => p.listingType === listingType)
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured)
}

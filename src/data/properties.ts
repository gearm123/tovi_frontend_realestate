import type { Property } from '../types/property'
import importedListings from './importedListings.json'

/**
 * Neighborhood options used by search filters and the admin listing form.
 * Includes areas found on the live ProperTLV inventory.
 */
export const neighborhoods = [
  'Lev HaIr',
  'Neve Tzedek',
  'Namal',
  'Tzameret',
  'Florentin',
  'Ramat Aviv',
  'Old North',
  'Sarona',
  'Jaffa',
  'Tel Aviv',
] as const

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'loft', label: 'Loft' },
] as const

/**
 * Live ProperTLV listings scraped from propertlv.com sale/rent archives.
 * Images are hosted on the original WordPress media CDN.
 * Manage/edit further via the admin panel.
 */
export const properties: Property[] = importedListings as Property[]

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function getPropertiesByStatus(status: Property['listingType']): Property[] {
  return properties.filter((p) => p.listingType === status)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured)
}

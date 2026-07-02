import type { Property } from '../types/property'
import type { PropertyFilters } from '../types/filters'

function matchesFeatureFilters(
  property: Property,
  filters: PropertyFilters,
): boolean {
  if (filters.balcony && !property.features.balcony) return false
  if (filters.parking && !property.features.parking) return false
  if (filters.elevator && !property.features.elevator) return false
  if (filters.mamad && !property.features.mamad) return false
  if (filters.miklat && !property.features.miklat) return false
  if (filters.petsAllowed && !property.features.petsAllowed) return false
  return true
}

/**
 * Pure client-side property filter — portable to server/CRM queries later.
 */
export function filterProperties(
  items: Property[],
  filters: PropertyFilters,
): Property[] {
  return items.filter((property) => {
    if (
      filters.listingStatus !== 'all' &&
      property.listingType !== filters.listingStatus
    ) {
      return false
    }
    if (filters.neighborhood && property.neighborhood !== filters.neighborhood) {
      return false
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false
    }
    if (
      property.priceNumeric < filters.priceMin ||
      property.priceNumeric > filters.priceMax
    ) {
      return false
    }
    if (filters.rooms !== '' && property.rooms < filters.rooms) {
      return false
    }
    if (!matchesFeatureFilters(property, filters)) {
      return false
    }
    return true
  })
}

export function countActiveFilters(filters: PropertyFilters): number {
  let count = 0
  if (filters.listingStatus !== 'all') count += 1
  if (filters.neighborhood) count += 1
  if (filters.propertyType) count += 1
  if (filters.rooms !== '') count += 1
  if (filters.priceMin > 0) count += 1
  if (filters.balcony) count += 1
  if (filters.parking) count += 1
  if (filters.elevator) count += 1
  if (filters.mamad) count += 1
  if (filters.miklat) count += 1
  if (filters.petsAllowed) count += 1
  return count
}

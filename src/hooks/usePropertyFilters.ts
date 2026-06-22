import { useMemo, useState } from 'react'
import type { Property } from '../types/property'
import { defaultFilters, type PropertyFilters } from '../types/filters'

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

export function filterProperties(
  items: Property[],
  filters: PropertyFilters,
): Property[] {
  return items.filter((property) => {
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
    if (filters.bedrooms !== '' && property.bedrooms < filters.bedrooms) {
      return false
    }
    if (!matchesFeatureFilters(property, filters)) {
      return false
    }
    return true
  })
}

export function usePropertyFilters(source: Property[]) {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters)

  const filtered = useMemo(
    () => filterProperties(source, filters),
    [source, filters],
  )

  const resetFilters = () => setFilters(defaultFilters)

  return { filters, setFilters, filtered, resetFilters }
}

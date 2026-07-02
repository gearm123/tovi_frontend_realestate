import { useMemo, useState } from 'react'
import type { ListingStatusFilter } from '../constants/propertySearch'
import { getPriceMaxForStatus } from '../constants/propertySearch'
import { filterProperties } from '../lib/propertySearch'
import type { Property } from '../types/property'
import { createDefaultFilters, type PropertyFilters } from '../types/filters'

interface UsePropertyFiltersOptions {
  initialStatus?: ListingStatusFilter
}

export function usePropertyFilters(
  source: Property[],
  options: UsePropertyFiltersOptions = {},
) {
  const { initialStatus = 'all' } = options
  const [filters, setFilters] = useState<PropertyFilters>(() =>
    createDefaultFilters(initialStatus),
  )

  const filtered = useMemo(
    () => filterProperties(source, filters),
    [source, filters],
  )

  const resetFilters = () => {
    setFilters(createDefaultFilters(filters.listingStatus))
  }

  const setListingStatus = (listingStatus: ListingStatusFilter) => {
    setFilters((prev) => ({
      ...createDefaultFilters(listingStatus),
      neighborhood: prev.neighborhood,
      propertyType: prev.propertyType,
      rooms: prev.rooms,
      balcony: prev.balcony,
      parking: prev.parking,
      elevator: prev.elevator,
      mamad: prev.mamad,
      miklat: prev.miklat,
      petsAllowed: prev.petsAllowed,
      priceMin: prev.priceMin,
      priceMax: Math.min(prev.priceMax, getPriceMaxForStatus(listingStatus)),
    }))
  }

  return { filters, setFilters, filtered, resetFilters, setListingStatus }
}

export { filterProperties } from '../lib/propertySearch'

import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ListingStatusFilter } from '../constants/propertySearch'
import { getPriceMaxForStatus } from '../constants/propertySearch'
import { filtersFromSearchParams, filtersToSearchParams } from '../lib/propertyFilterQuery'
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
  const [params, setParams] = useSearchParams()
  const filters = useMemo(
    () => filtersFromSearchParams(params, initialStatus),
    [params, initialStatus],
  )

  const filtered = useMemo(
    () => filterProperties(source, filters),
    [source, filters],
  )

  const writeFilters = (next: PropertyFilters) => {
    const serialized = filtersToSearchParams(next, initialStatus)
    if (serialized.toString() === filtersToSearchParams(filters, initialStatus).toString()) return
    setParams(serialized, { replace: true })
  }

  const resetFilters = () => {
    writeFilters(createDefaultFilters(filters.listingStatus))
  }

  const setListingStatus = (listingStatus: ListingStatusFilter) => {
    writeFilters({
      ...createDefaultFilters(listingStatus),
      neighborhood: filters.neighborhood,
      propertyType: filters.propertyType,
      rooms: filters.rooms,
      sizeMin: filters.sizeMin,
      balcony: filters.balcony,
      parking: filters.parking,
      elevator: filters.elevator,
      mamad: filters.mamad,
      miklat: filters.miklat,
      petsAllowed: filters.petsAllowed,
      propertyCode: filters.propertyCode,
      priceMin: filters.priceMin,
      priceMax: Math.min(filters.priceMax, getPriceMaxForStatus(listingStatus)),
    })
  }

  return { filters, setFilters: writeFilters, filtered, resetFilters, setListingStatus }
}

export { filterProperties } from '../lib/propertySearch'

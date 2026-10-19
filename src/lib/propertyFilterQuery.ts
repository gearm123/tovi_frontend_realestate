import type { ListingStatusFilter } from '../constants/propertySearch'
import { getPriceMaxForStatus } from '../constants/propertySearch'
import { createDefaultFilters, type PropertyFilters } from '../types/filters'
import type { PropertyType } from '../types/property'

const STATUSES: ListingStatusFilter[] = ['all', 'sale', 'rental']

function statusFromParam(value: string | null, fallback: ListingStatusFilter): ListingStatusFilter {
  return STATUSES.includes(value as ListingStatusFilter) ? (value as ListingStatusFilter) : fallback
}

function numberParam(value: string | null): number | '' {
  if (!value) return ''
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ''
}

/** Reads the search address back into the filter bar. */
export function filtersFromSearchParams(
  params: URLSearchParams,
  initialStatus: ListingStatusFilter,
): PropertyFilters {
  const listingStatus = statusFromParam(params.get('status'), initialStatus)
  const defaults = createDefaultFilters(listingStatus)
  const priceMax = numberParam(params.get('max'))
  const priceMin = numberParam(params.get('min'))
  return {
    ...defaults,
    neighborhood: params.get('area') ?? '',
    propertyType: (params.get('type') ?? '') as PropertyType | '',
    rooms: numberParam(params.get('rooms')),
    sizeMin: numberParam(params.get('size')),
    priceMin: priceMin === '' ? 0 : priceMin,
    priceMax: priceMax === '' ? defaults.priceMax : priceMax,
    balcony: params.get('balcony') === '1',
    parking: params.get('parking') === '1',
    elevator: params.get('elevator') === '1',
    mamad: params.get('mamad') === '1',
    miklat: params.get('miklat') === '1',
    petsAllowed: params.get('pets') === '1',
    propertyCode: params.get('id') ?? '',
  }
}

/** Writes only the choices that differ from a fresh search. */
export function filtersToSearchParams(
  filters: PropertyFilters,
  initialStatus: ListingStatusFilter,
): URLSearchParams {
  const params = new URLSearchParams()
  const priceLimit = getPriceMaxForStatus(filters.listingStatus)
  if (filters.listingStatus !== initialStatus) params.set('status', filters.listingStatus)
  if (filters.neighborhood) params.set('area', filters.neighborhood)
  if (filters.propertyType) params.set('type', filters.propertyType)
  if (filters.rooms !== '') params.set('rooms', String(filters.rooms))
  if (filters.sizeMin !== '') params.set('size', String(filters.sizeMin))
  if (filters.priceMin > 0) params.set('min', String(filters.priceMin))
  if (filters.priceMax < priceLimit) params.set('max', String(filters.priceMax))
  if (filters.balcony) params.set('balcony', '1')
  if (filters.parking) params.set('parking', '1')
  if (filters.elevator) params.set('elevator', '1')
  if (filters.mamad) params.set('mamad', '1')
  if (filters.miklat) params.set('miklat', '1')
  if (filters.petsAllowed) params.set('pets', '1')
  if (filters.propertyCode.trim()) params.set('id', filters.propertyCode.trim())
  return params
}

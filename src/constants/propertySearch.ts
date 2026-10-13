/** Top of the price slider. A slider left here does not hide higher prices. */
export const SALE_PRICE_MAX = 30_000_000
export const RENTAL_PRICE_MAX = 80_000

export type ListingStatusFilter = 'all' | 'sale' | 'rental'

export const SIZE_MIN_OPTIONS = [50, 70, 90, 120, 150] as const

export function getPriceMaxForStatus(status: ListingStatusFilter): number {
  if (status === 'rental') return RENTAL_PRICE_MAX
  if (status === 'sale') return SALE_PRICE_MAX
  return SALE_PRICE_MAX
}

export function getPriceStepForStatus(status: ListingStatusFilter): number {
  if (status === 'rental') return 500
  return 100_000
}

export function isRentalPriceContext(status: ListingStatusFilter): boolean {
  return status === 'rental'
}

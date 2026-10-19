/** Client-side search limits — adjust when connecting to live CRM data */
export const SALE_PRICE_MAX = 10_000_000
export const RENTAL_PRICE_MAX = 25_000

export type ListingStatusFilter = 'all' | 'sale' | 'rental'

export const SIZE_MIN_OPTIONS = [50, 70, 90, 120, 150] as const

/** Minimum room counts. Half rooms match listings such as 2.5 and 3.5. */
export const ROOM_MIN_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7] as const

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

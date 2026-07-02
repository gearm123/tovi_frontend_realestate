/** Client-side search limits — adjust when connecting to live CRM data */
export const SALE_PRICE_MAX = 10_000_000
export const RENTAL_PRICE_MAX = 25_000

export type ListingStatusFilter = 'all' | 'sale' | 'rental'

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

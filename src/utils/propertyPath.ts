import type { Property } from '../types/property'

export function getPropertyDetailPath(property: Pick<Property, 'id' | 'listingType'>): string {
  return property.listingType === 'sale'
    ? `/property/sale/${property.id}`
    : `/property/rental/${property.id}`
}

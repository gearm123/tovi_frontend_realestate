import type { Property } from '../types/property'

export function getSimilarProperties(
  property: Property,
  catalog: Property[],
  limit = 3,
): Property[] {
  const scored = catalog
    .filter((item) => item.id !== property.id)
    .map((item) => {
      let score = 0
      if (item.listingType === property.listingType) score += 8
      if (item.neighborhood === property.neighborhood) score += 6
      if (item.propertyType === property.propertyType) score += 3
      if (item.featured) score += 1
      const basis = Math.max(property.priceNumeric, 1)
      const delta = Math.abs(item.priceNumeric - property.priceNumeric) / basis
      if (delta < 0.25) score += 3
      else if (delta < 0.5) score += 1
      if (Math.abs(item.rooms - property.rooms) <= 1) score += 2
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((entry) => entry.item)
}

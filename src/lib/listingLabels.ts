import type { Property } from '../types/property'

export type ListingLabelKey = 'featured' | 'exclusive' | 'new'

export function getListingLabels(
  property: Pick<Property, 'id' | 'title' | 'featured' | 'exclusive' | 'isNew'>,
): ListingLabelKey[] {
  const labels: ListingLabelKey[] = []
  const title = property.title ?? ''
  const haystack = `${property.id} ${title}`

  if (property.featured) labels.push('featured')

  if (property.exclusive || /\bexclusive\b/i.test(haystack)) {
    labels.push('exclusive')
  }

  if (property.isNew || /\bnew listing\b/i.test(haystack) || /^\s*new\b/i.test(title)) {
    labels.push('new')
  }

  return labels
}

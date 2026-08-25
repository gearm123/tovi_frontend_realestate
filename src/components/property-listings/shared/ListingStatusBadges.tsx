import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getListingLabels, type ListingLabelKey } from '../../../lib/listingLabels'
import './ListingStatusBadges.css'

interface ListingStatusBadgesProps {
  property: Pick<Property, 'id' | 'title' | 'featured' | 'exclusive' | 'isNew'>
  className?: string
}

export default function ListingStatusBadges({
  property,
  className = '',
}: ListingStatusBadgesProps) {
  const { t } = useLanguage()
  const labels = getListingLabels(property)
  if (labels.length === 0) return null

  const text: Record<ListingLabelKey, string> = {
    featured: t.property.featured,
    exclusive: t.property.exclusive,
    new: t.property.newListing,
  }

  return (
    <>
      {labels.map((key) => (
        <span
          key={key}
          className={`listing-status-badge listing-status-badge--${key}${className ? ` ${className}` : ''}`}
        >
          {text[key]}
        </span>
      ))}
    </>
  )
}

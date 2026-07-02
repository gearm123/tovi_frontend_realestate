import type { ListingType } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import './ListingTypeBadge.css'

interface ListingTypeBadgeProps {
  listingType: ListingType
  /** overlay = on image frame; inline = in page body */
  variant?: 'overlay' | 'inline'
  className?: string
}

export default function ListingTypeBadge({
  listingType,
  variant = 'overlay',
  className = '',
}: ListingTypeBadgeProps) {
  const { t } = useLanguage()
  const label = listingType === 'sale' ? t.property.forSale : t.property.forRent

  return (
    <span
      className={`listing-type-badge listing-type-badge--${listingType} listing-type-badge--${variant} ${className}`.trim()}
    >
      {label}
    </span>
  )
}

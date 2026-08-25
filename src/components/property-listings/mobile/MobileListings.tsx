import type { Property } from '../../../types/property'
import ListingsHeader from '../shared/ListingsHeader'
import MobilePropertyCard from './MobilePropertyCard'
import './MobileListings.css'

interface MobileListingsProps {
  properties: Property[]
  sectionLabel: string
  title: string
  intro?: string
  showHeader: boolean
  collapseDescription?: boolean
  hideDescription?: boolean
}

export default function MobileListings({
  properties,
  sectionLabel,
  title,
  intro,
  showHeader,
  collapseDescription = false,
  hideDescription = false,
}: MobileListingsProps) {
  return (
    <section id="listings" className="mobile-listings" aria-label="Property listings">
      {showHeader && (
        <ListingsHeader
          sectionLabel={sectionLabel}
          title={title}
          intro={intro}
        />
      )}

      {!showHeader && properties.length > 0 && (
        <p className="mobile-listings__count">{sectionLabel}</p>
      )}

      {properties.length === 0 ? (
        <p className="mobile-listings__empty">No properties match your filters.</p>
      ) : (
        <div className="mobile-listings__stack">
          {properties.map((property, index) => (
            <MobilePropertyCard
              key={property.id}
              property={property}
              index={index}
              collapseDescription={collapseDescription}
              hideDescription={hideDescription}
            />
          ))}
        </div>
      )}
    </section>
  )
}

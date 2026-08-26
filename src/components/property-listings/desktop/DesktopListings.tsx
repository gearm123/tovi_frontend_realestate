import type { Property } from '../../../types/property'
import ListingsHeader from '../shared/ListingsHeader'
import DesktopPropertyCard from './DesktopPropertyCard'
import './DesktopListings.css'

interface DesktopListingsProps {
  properties: Property[]
  sectionLabel: string
  title: string
  intro?: string
  showHeader: boolean
  sectionId?: string
}

export default function DesktopListings({
  properties,
  sectionLabel,
  title,
  intro,
  showHeader,
  sectionId = 'listings',
}: DesktopListingsProps) {
  return (
    <section id={sectionId} className="desktop-listings" aria-label="Property listings">
      {showHeader && (
        <ListingsHeader
          sectionLabel={sectionLabel}
          title={title}
          intro={intro}
        />
      )}

      {!showHeader && properties.length > 0 && (
        <p className="desktop-listings__count">{sectionLabel}</p>
      )}

      {properties.length === 0 ? (
        <p className="desktop-listings__empty">No properties match your filters.</p>
      ) : (
        <div className="desktop-listings__stack">
          {properties.map((property, index) => (
            <DesktopPropertyCard
              key={property.id}
              property={property}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  )
}

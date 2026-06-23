import type { Property } from '../../../types/property'
import PropertyCardBody from '../shared/PropertyCardBody'
import PropertyImage from '../shared/PropertyImage'
import './DesktopPropertyCard.css'

interface DesktopPropertyCardProps {
  property: Property
  index: number
}

export default function DesktopPropertyCard({
  property,
  index,
}: DesktopPropertyCardProps) {
  return (
    <article
      className="desktop-property"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="desktop-property__image-wrap">
        <div className="desktop-property__image-frame">
          <PropertyImage
            imagePath={property.image}
            alt={property.title}
            className="desktop-property__image"
            priority={index < 2}
          />
          {property.featured && (
            <span className="desktop-property__badge">Featured</span>
          )}
          <span className="desktop-property__price">{property.price}</span>
        </div>
      </div>

      <PropertyCardBody property={property} classPrefix="desktop-property" />
    </article>
  )
}

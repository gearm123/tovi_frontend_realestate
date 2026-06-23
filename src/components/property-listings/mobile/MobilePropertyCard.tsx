import type { Property } from '../../../types/property'
import PropertyCardBody from '../shared/PropertyCardBody'
import PropertyImage from '../shared/PropertyImage'
import './MobilePropertyCard.css'

interface MobilePropertyCardProps {
  property: Property
  index: number
}

export default function MobilePropertyCard({
  property,
  index,
}: MobilePropertyCardProps) {
  return (
    <article
      className="mobile-property"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="mobile-property__image-wrap">
        <div className="mobile-property__image-frame">
          <PropertyImage
            imagePath={property.image}
            alt={property.title}
            className="mobile-property__image"
            priority={index < 2}
          />
          {property.featured && (
            <span className="mobile-property__badge">Featured</span>
          )}
          <span className="mobile-property__price">{property.price}</span>
        </div>
      </div>

      <PropertyCardBody property={property} classPrefix="mobile-property" />
    </article>
  )
}

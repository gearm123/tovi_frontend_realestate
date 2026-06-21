import type { Property } from '../../../types/property'

interface PropertyCardBodyProps {
  property: Property
  classPrefix: 'desktop-property' | 'mobile-property'
}

export default function PropertyCardBody({
  property,
  classPrefix,
}: PropertyCardBodyProps) {
  return (
    <div className={`${classPrefix}__body`}>
      <p className={`${classPrefix}__neighborhood`}>{property.neighborhood}</p>
      <h3 className={`${classPrefix}__title`}>{property.title}</h3>

      <div className={`${classPrefix}__specs`}>
        <span>{property.bedrooms} bed</span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>{property.bathrooms} bath</span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>{property.area} m²</span>
      </div>

      <p className={`${classPrefix}__description`}>{property.description}</p>

      <div className={`${classPrefix}__footer`}>
        <span className={`${classPrefix}__price`}>{property.price}</span>
        <button type="button" className={`${classPrefix}__link`}>
          View details
        </button>
      </div>
    </div>
  )
}

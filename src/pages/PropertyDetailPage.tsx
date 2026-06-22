import { Link, useParams } from 'react-router-dom'
import { getPropertyById, propertyTypes } from '../data/properties'
import PropertyImage from '../components/property-listings/shared/PropertyImage'
import './PropertyDetailPage.css'

const featureLabels: { key: keyof import('../types/property').PropertyFeatures; label: string }[] = [
  { key: 'balcony', label: 'Balcony' },
  { key: 'parking', label: 'Parking' },
  { key: 'elevator', label: 'Elevator' },
  { key: 'mamad', label: 'Mamad' },
  { key: 'miklat', label: 'Miklat' },
  { key: 'petsAllowed', label: 'Pets allowed' },
]

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const property = id ? getPropertyById(id) : undefined

  if (!property) {
    return (
      <div className="property-detail property-detail--missing">
        <h1>Property not found</h1>
        <Link to="/">Return home</Link>
      </div>
    )
  }

  const typeLabel =
    propertyTypes.find((t) => t.value === property.propertyType)?.label ??
    property.propertyType

  const listingLabel = property.listingType === 'sale' ? 'For Sale' : 'For Rent'

  return (
    <article className="property-detail">
      <div className="property-detail__image-wrap">
        <PropertyImage
          imagePath={property.image}
          alt={property.title}
          className="property-detail__image"
          priority
        />
        {property.featured && (
          <span className="property-detail__badge">Featured</span>
        )}
      </div>

      <div className="property-detail__body">
        <p className="property-detail__listing-type">{listingLabel}</p>
        <p className="property-detail__neighborhood">{property.neighborhood}</p>
        <h1 className="property-detail__title">{property.title}</h1>
        <p className="property-detail__address">{property.address}</p>

        <div className="property-detail__specs">
          <span>{property.bedrooms} bed</span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>{property.bathrooms} bath</span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>{property.area} m²</span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>{typeLabel}</span>
        </div>

        <p className="property-detail__price">{property.price}</p>
        <p className="property-detail__description">{property.description}</p>

        <div className="property-detail__features">
          <h2>Features</h2>
          <ul>
            {featureLabels.map(({ key, label }) => (
              <li
                key={key}
                className={
                  property.features[key] ? '' : 'property-detail__feature--off'
                }
              >
                {label}
                {property.features[key] ? ' ✓' : ' —'}
              </li>
            ))}
          </ul>
        </div>

        <div className="property-detail__actions">
          <Link to="/contact" className="property-detail__cta">
            Contact us about this property
          </Link>
          <Link
            to={property.listingType === 'sale' ? '/sales' : '/rentals'}
            className="property-detail__back"
          >
            Back to listings
          </Link>
        </div>
      </div>
    </article>
  )
}

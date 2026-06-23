import { Link, useParams } from 'react-router-dom'
import { getPropertyById } from '../data/properties'
import PropertyImage from '../components/property-listings/shared/PropertyImage'
import { useLanguage } from '../context/LanguageContext'
import { getLocalizedProperty } from '../i18n/propertyTranslations'
import './PropertyDetailPage.css'

const featureKeys = [
  'balcony',
  'parking',
  'elevator',
  'mamad',
  'miklat',
  'petsAllowed',
] as const

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, locale } = useLanguage()
  const property = id ? getPropertyById(id) : undefined

  if (!property) {
    return (
      <div className="property-detail property-detail--missing">
        <h1>{t.property.notFound}</h1>
        <Link to="/">{t.property.returnHome}</Link>
      </div>
    )
  }

  const localized = getLocalizedProperty(property.id, locale, {
    title: property.title,
    address: property.address,
    description: property.description,
    price: property.price,
    neighborhood: property.neighborhood,
  })

  const typeLabel =
    (t.propertyTypes as Record<string, string>)[property.propertyType] ??
    property.propertyType

  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[property.neighborhood] ??
    property.neighborhood

  const listingLabel =
    property.listingType === 'sale' ? t.property.forSale : t.property.forRent

  return (
    <article className="property-detail">
      <div className="property-detail__image-wrap">
        <PropertyImage
          imagePath={property.image}
          alt={localized.title}
          className="property-detail__image"
          priority
        />
        {property.featured && (
          <span className="property-detail__badge">{t.property.featured}</span>
        )}
      </div>

      <div className="property-detail__body">
        <p className="property-detail__listing-type">{listingLabel}</p>
        <p className="property-detail__neighborhood">{neighborhoodLabel}</p>
        <h1 className="property-detail__title">{localized.title}</h1>
        <p className="property-detail__address">{localized.address}</p>

        <div className="property-detail__specs">
          <span>
            {property.bedrooms} {t.property.bed}
          </span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>
            {property.bathrooms} {t.property.bath}
          </span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>{property.area} m²</span>
          <span className="property-detail__dot" aria-hidden="true" />
          <span>{typeLabel}</span>
        </div>

        <p className="property-detail__price">
          {localized.price ?? property.price}
        </p>
        <p className="property-detail__description">{localized.description}</p>

        <div className="property-detail__features">
          <h2>{t.property.features}</h2>
          <ul>
            {featureKeys.map((key) => (
              <li
                key={key}
                className={
                  property.features[key] ? '' : 'property-detail__feature--off'
                }
              >
                {t.filters.features[key]}
                {property.features[key] ? ` ${t.property.yes}` : ` ${t.property.no}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="property-detail__actions">
          <Link to="/contact" className="property-detail__cta">
            {t.property.contactCta}
          </Link>
          <Link
            to={property.listingType === 'sale' ? '/sales' : '/rentals'}
            className="property-detail__back"
          >
            {t.property.backToListings}
          </Link>
        </div>
      </div>
    </article>
  )
}

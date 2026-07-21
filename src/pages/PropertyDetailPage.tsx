import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConversionSections from '../components/conversion/ConversionSections'
import PageSeo from '../components/seo/PageSeo'
import VideoEmbed from '../components/shared/VideoEmbed'
import PropertyAgentCard from '../components/property-listings/shared/PropertyAgentCard'
import { getAgentForProperty } from '../services/agentService'
import ListingTypeBadge from '../components/property-listings/shared/ListingTypeBadge'
import PropertyImageGallery from '../components/property-listings/shared/PropertyImageGallery'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from '../hooks/useSiteData'
import { useViewport } from '../hooks/useViewport'
import { getLocalizedProperty } from '../i18n/propertyTranslations'
import { getPropertyImages } from '../utils/propertyGallery'
import { isPlayableVideoUrl } from '../utils/propertyVideo'
import { getPropertyContactPath } from '../utils/propertyContact'
import { getPropertyDetailPath } from '../utils/propertyPath'
import { buildRealEstateListingJsonLd } from '../seo/structuredData'
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
  const viewport = useViewport()
  const { properties } = useSiteData()
  const property = id ? properties.find((item) => item.id === id) : undefined

  const localizedPreview = useMemo(() => {
    if (!property) return null
    return getLocalizedProperty(property.id, locale, {
      title: property.title,
      address: property.address,
      description: property.description,
      price: property.price,
      neighborhood: property.neighborhood,
    })
  }, [property, locale])

  const propertyPath = property ? getPropertyDetailPath(property) : undefined

  const propertyJsonLd = useMemo(() => {
    if (!property || !localizedPreview || !propertyPath) return undefined
    return buildRealEstateListingJsonLd(property, localizedPreview, propertyPath)
  }, [property, localizedPreview, propertyPath])

  if (!property) {
    return (
      <>
        <PageSeo
          title={t.property.notFound}
          description={t.property.returnHome}
          noIndex
        />
        <div className="property-detail property-detail--missing">
          <h1>{t.property.notFound}</h1>
          <Link to="/">{t.property.returnHome}</Link>
        </div>
      </>
    )
  }

  const localized = localizedPreview!
  const galleryImages = getPropertyImages(property)

  const typeLabel =
    (t.propertyTypes as Record<string, string>)[property.propertyType] ??
    property.propertyType

  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[property.neighborhood] ??
    property.neighborhood

  const showVideoTour =
    property.videoUrl && isPlayableVideoUrl(property.videoUrl)

  const agent = getAgentForProperty(property, locale)

  return (
    <>
      <PageSeo
        title={`${localized.title} — ProperTLV`}
        description={localized.description.slice(0, 155)}
        path={propertyPath}
        image={galleryImages[0]}
        jsonLd={propertyJsonLd}
      />
      <article className={`property-detail property-detail--${viewport}`}>
        <PropertyImageGallery
          property={property}
          alt={localized.title}
          label={t.property.photoGallery}
          badges={
            <>
              <ListingTypeBadge listingType={property.listingType} />
              {property.featured && (
                <span className="property-detail__badge">{t.property.featured}</span>
              )}
            </>
          }
        />

        <div className="property-detail__body">
          {viewport === 'desktop' && (
            <ListingTypeBadge listingType={property.listingType} variant="inline" />
          )}
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

          {showVideoTour && (
            <section className="property-detail__video" aria-labelledby="property-video-title">
              <h2 id="property-video-title">{t.property.videoTour}</h2>
              <VideoEmbed
                videoUrl={property.videoUrl!}
                title={`${localized.title} — ${t.property.videoTour}`}
              />
            </section>
          )}

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

          <PropertyAgentCard
            agent={agent}
            property={property}
            propertyTitle={localized.title}
          />

          <div className="property-detail__actions">
            <Link to={getPropertyContactPath(property)} className="property-detail__cta">
              {t.property.contactCta}
            </Link>
            <Link
              to={property.listingType === 'sale' ? '/sales' : '/rentals'}
              className="property-detail__back"
            >
              {t.property.backToListings}
            </Link>
          </div>

          <ConversionSections variant="stacked" compact />
        </div>
      </article>
    </>
  )
}

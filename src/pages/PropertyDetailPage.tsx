import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageSeo from '../components/seo/PageSeo'
import VideoEmbed from '../components/shared/VideoEmbed'
import PropertyAgentCard from '../components/property-listings/shared/PropertyAgentCard'
import PropertyFacts from '../components/property-listings/shared/PropertyFacts'
import SimilarProperties from '../components/property-listings/shared/SimilarProperties'
import { getAgentForProperty } from '../services/agentService'
import ListingTypeBadge from '../components/property-listings/shared/ListingTypeBadge'
import ListingStatusBadges from '../components/property-listings/shared/ListingStatusBadges'
import PropertyImageGallery from '../components/property-listings/shared/PropertyImageGallery'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from '../hooks/useSiteData'
import { useViewport } from '../hooks/useViewport'
import { getLocalizedProperty } from '../i18n/propertyTranslations'
import { listingTextDir } from '../utils/listingCopy'
import { getPropertyImages } from '../utils/propertyGallery'
import { isPlayableVideoUrl } from '../utils/propertyVideo'
import { getPropertyDetailPath } from '../utils/propertyPath'
import { splitListingNarrative } from '../lib/listingNarrative'
import { getSimilarProperties } from '../lib/similarProperties'
import { buildRealEstateListingJsonLd } from '../seo/structuredData'
import './PropertyDetailPage.css'

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

  const narrative = useMemo(
    () => splitListingNarrative(localizedPreview?.description ?? ''),
    [localizedPreview],
  )

  const similar = useMemo(
    () => (property ? getSimilarProperties(property, properties, 3) : []),
    [property, properties],
  )

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
  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[property.neighborhood] ??
    property.neighborhood
  const showVideoTour = property.videoUrl && isPlayableVideoUrl(property.videoUrl)
  const agent = getAgentForProperty(property, locale)
  const highlights = narrative.highlights
  const copyDir = listingTextDir(
    `${localized.title} ${localized.address} ${localized.description}`,
  )

  return (
    <>
      <PageSeo
        title={`${localized.title} | ProperTLV`}
        description={(narrative.intro || localized.description).slice(0, 155)}
        path={propertyPath}
        image={galleryImages[0]}
        jsonLd={propertyJsonLd}
      />
      <article className={`property-detail property-detail--${viewport}`}>
        <div className="property-detail__gallery">
          <PropertyImageGallery
            property={property}
            alt={localized.title}
            label={t.property.photoGallery}
            variant="detail"
            priority
            badges={
              <>
                <ListingStatusBadges property={property} />
                <ListingTypeBadge listingType={property.listingType} />
              </>
            }
          />
        </div>

        <div className="property-detail__body" dir={copyDir}>
          <p className="property-detail__price">{localized.price ?? property.price}</p>
          <PropertyFacts property={property} floor={narrative.floor} />

          <p className="property-detail__neighborhood">{neighborhoodLabel}</p>
          <h1
            className="property-detail__title listing-copy"
            dir={listingTextDir(localized.title)}
          >
            {localized.title}
          </h1>
          <p
            className="property-detail__address listing-copy"
            dir={listingTextDir(localized.address)}
          >
            {localized.address}
          </p>

          {narrative.intro ? (
            <p
              className="property-detail__intro listing-copy"
              dir={listingTextDir(narrative.intro)}
            >
              {narrative.intro}
            </p>
          ) : null}

          {highlights.length > 0 && (
            <section className="property-detail__highlights" aria-labelledby="property-highlights-title">
              <h2 id="property-highlights-title">{t.property.highlightsTitle}</h2>
              <ul>
                {highlights.map((item) => (
                  <li key={item} className="listing-copy" dir={listingTextDir(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {narrative.specialNotes.length > 0 && (
            <aside className="property-detail__special" aria-labelledby="property-special-title">
              <h2 id="property-special-title">{t.property.specialInfoTitle}</h2>
              {narrative.specialNotes.map((note) => (
                <p key={note} className="listing-copy" dir={listingTextDir(note)}>
                  {note}
                </p>
              ))}
            </aside>
          )}

          {showVideoTour && (
            <section className="property-detail__video" aria-labelledby="property-video-title">
              <h2 id="property-video-title">{t.property.videoTour}</h2>
              <VideoEmbed
                videoUrl={property.videoUrl!}
                title={`${localized.title} (${t.property.videoTour})`}
              />
            </section>
          )}

          <PropertyAgentCard
            agent={agent}
            property={property}
            propertyTitle={localized.title}
          />

          <Link
            to={property.listingType === 'sale' ? '/sales' : '/rentals'}
            className="property-detail__back"
          >
            {t.property.backToListings}
          </Link>
        </div>

        <SimilarProperties properties={similar} />
      </article>
    </>
  )
}

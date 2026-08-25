import { Link } from 'react-router-dom'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { hasPropertyVideoTour } from '../../../utils/propertyVideo'
import { getPropertyDetailPath } from '../../../utils/propertyPath'
import ListingTypeBadge from '../shared/ListingTypeBadge'
import ListingStatusBadges from '../shared/ListingStatusBadges'
import PropertyCardBody from '../shared/PropertyCardBody'
import PropertyImageGallery from '../shared/PropertyImageGallery'
import VideoTourBadge from '../shared/VideoTourBadge'
import './MobilePropertyCard.css'

interface MobilePropertyCardProps {
  property: Property
  index: number
}

export default function MobilePropertyCard({
  property,
  index,
}: MobilePropertyCardProps) {
  const { t, locale } = useLanguage()

  const localized = getLocalizedProperty(property.id, locale, {
    title: property.title,
    address: property.address,
    description: property.description,
    price: property.price,
    neighborhood: property.neighborhood,
  })
  const detailPath = getPropertyDetailPath(property)

  return (
    <article
      className="mobile-property"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Link
        to={detailPath}
        className="mobile-property__hit"
        aria-label={localized.title}
      >
        <div className="mobile-property__image-wrap">
          <div className="mobile-property__image-frame">
            <PropertyImageGallery
              property={property}
              alt={localized.title}
              label={t.property.photoGallery}
              variant="card"
              priority={index < 2}
              badges={
                <div className="mobile-property__badges">
                  <ListingStatusBadges property={property} />
                  <ListingTypeBadge listingType={property.listingType} />
                </div>
              }
            />
            {hasPropertyVideoTour(property.videoUrl) && (
              <span className="mobile-property__video-tour">
                <VideoTourBadge label={t.property.videoTour} />
              </span>
            )}
          </div>
        </div>

        <PropertyCardBody property={property} classPrefix="mobile-property" />
      </Link>
    </article>
  )
}

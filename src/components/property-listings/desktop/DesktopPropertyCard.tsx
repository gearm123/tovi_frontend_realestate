import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { hasPropertyVideoTour } from '../../../utils/propertyVideo'
import ListingTypeBadge from '../shared/ListingTypeBadge'
import ListingStatusBadges from '../shared/ListingStatusBadges'
import PropertyCardBody from '../shared/PropertyCardBody'
import PropertyImageGallery from '../shared/PropertyImageGallery'
import VideoTourBadge from '../shared/VideoTourBadge'
import './DesktopPropertyCard.css'

interface DesktopPropertyCardProps {
  property: Property
  index: number
}

export default function DesktopPropertyCard({
  property,
  index,
}: DesktopPropertyCardProps) {
  const { t, locale } = useLanguage()

  const localized = getLocalizedProperty(property.id, locale, {
    title: property.title,
    address: property.address,
    description: property.description,
    price: property.price,
    neighborhood: property.neighborhood,
  })

  return (
    <article
      className="desktop-property"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="desktop-property__image-wrap">
        <div className="desktop-property__image-frame">
          <PropertyImageGallery
            property={property}
            alt={localized.title}
            label={t.property.photoGallery}
            variant="card"
            priority={index < 2}
            badges={
              <div className="desktop-property__badges">
                <ListingStatusBadges property={property} />
                <ListingTypeBadge listingType={property.listingType} />
              </div>
            }
          />
          {hasPropertyVideoTour(property.videoUrl) && (
            <span className="desktop-property__video-tour">
              <VideoTourBadge label={t.property.videoTour} />
            </span>
          )}
        </div>
      </div>

      <PropertyCardBody property={property} classPrefix="desktop-property" />
    </article>
  )
}

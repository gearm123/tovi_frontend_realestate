import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { hasPropertyVideoTour } from '../../../utils/propertyVideo'
import ListingTypeBadge from '../shared/ListingTypeBadge'
import PropertyCardBody from '../shared/PropertyCardBody'
import PropertyImageGallery from '../shared/PropertyImageGallery'
import VideoTourBadge from '../shared/VideoTourBadge'
import './DesktopPropertyCard.css'

interface DesktopPropertyCardProps {
  property: Property
  index: number
  collapseDescription?: boolean
  hideDescription?: boolean
}

export default function DesktopPropertyCard({
  property,
  index,
  collapseDescription = false,
  hideDescription = false,
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
                <ListingTypeBadge listingType={property.listingType} />
                {property.featured && (
                  <span className="desktop-property__badge">{t.property.featured}</span>
                )}
              </div>
            }
          />
          <span className="desktop-property__price">
            {localized.price ?? property.price}
          </span>
          {hasPropertyVideoTour(property.videoUrl) && (
            <span className="desktop-property__video-tour">
              <VideoTourBadge label={t.property.videoTour} />
            </span>
          )}
        </div>
      </div>

      <PropertyCardBody
        property={property}
        classPrefix="desktop-property"
        collapseDescription={collapseDescription}
        hideDescription={hideDescription}
      />
    </article>
  )
}

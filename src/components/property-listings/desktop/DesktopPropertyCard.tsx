import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
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
          <PropertyImage
            imagePath={property.image}
            alt={localized.title}
            className="desktop-property__image"
            priority={index < 2}
          />
          {property.featured && (
            <span className="desktop-property__badge">{t.property.featured}</span>
          )}
          <span className="desktop-property__price">
            {localized.price ?? property.price}
          </span>
        </div>
      </div>

      <PropertyCardBody property={property} classPrefix="desktop-property" />
    </article>
  )
}

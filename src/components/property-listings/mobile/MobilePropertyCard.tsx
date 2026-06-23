import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
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
      className="mobile-property"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="mobile-property__image-wrap">
        <div className="mobile-property__image-frame">
          <PropertyImage
            imagePath={property.image}
            alt={localized.title}
            className="mobile-property__image"
            priority={index < 2}
          />
          {property.featured && (
            <span className="mobile-property__badge">{t.property.featured}</span>
          )}
          <span className="mobile-property__price">
            {localized.price ?? property.price}
          </span>
        </div>
      </div>

      <PropertyCardBody property={property} classPrefix="mobile-property" />
    </article>
  )
}

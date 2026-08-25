import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { listingTextDir } from '../../../utils/listingCopy'

interface PropertyCardBodyProps {
  property: Property
  classPrefix: 'desktop-property' | 'mobile-property'
}

export default function PropertyCardBody({
  property,
  classPrefix,
}: PropertyCardBodyProps) {
  const { t, locale } = useLanguage()

  const localized = getLocalizedProperty(property.id, locale, {
    title: property.title,
    address: property.address,
    description: property.description,
    price: property.price,
    neighborhood: property.neighborhood,
  })

  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[property.neighborhood] ??
    property.neighborhood

  return (
    <div className={`${classPrefix}__body`} dir={listingTextDir(localized.title)}>
      <p className={`${classPrefix}__price`}>{localized.price ?? property.price}</p>

      <div className={`${classPrefix}__specs`}>
        <span>
          {property.area} m²
        </span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>
          {property.rooms} {t.property.rooms}
        </span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>
          {property.bedrooms} {t.property.bed}
        </span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>
          {property.bathrooms} {t.property.bath}
        </span>
      </div>

      <p className={`${classPrefix}__neighborhood`}>{neighborhoodLabel}</p>
    </div>
  )
}

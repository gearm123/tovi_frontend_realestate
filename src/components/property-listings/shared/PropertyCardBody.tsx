import { Link } from 'react-router-dom'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { getAgentForProperty } from '../../../services/agentService'
import { getPropertyDetailPath } from '../../../utils/propertyPath'

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

  const detailPath = getPropertyDetailPath(property)
  const agent = getAgentForProperty(property, locale)

  return (
    <div className={`${classPrefix}__body`}>
      <p className={`${classPrefix}__neighborhood`}>{neighborhoodLabel}</p>
      <h3 className={`${classPrefix}__title`}>{localized.title}</h3>
      <p className={`${classPrefix}__address`}>{localized.address}</p>

      <div className={`${classPrefix}__specs`}>
        <span>
          {property.bedrooms} {t.property.bed}
        </span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>
          {property.bathrooms} {t.property.bath}
        </span>
        <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
        <span>{property.area} m²</span>
      </div>

      <p className={`${classPrefix}__description`}>{localized.description}</p>

      <p className={`${classPrefix}__agent`}>
        {t.property.listedWith.replace('{name}', agent.name)}
      </p>

      <div className={`${classPrefix}__footer`}>
        <Link to={detailPath} className={`${classPrefix}__link`}>
          {t.property.viewDetails}
        </Link>
      </div>
    </div>
  )
}

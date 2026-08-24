import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { listingExcerpt, listingTextDir } from '../../../utils/listingCopy'
import { getPropertyDetailPath } from '../../../utils/propertyPath'

interface PropertyCardBodyProps {
  property: Property
  classPrefix: 'desktop-property' | 'mobile-property'
  collapseDescription?: boolean
}

export default function PropertyCardBody({
  property,
  classPrefix,
  collapseDescription = false,
}: PropertyCardBodyProps) {
  const { t, locale } = useLanguage()
  const [expanded, setExpanded] = useState(false)

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
  const { preview, truncated } = listingExcerpt(localized.description)
  const description = collapseDescription && truncated && !expanded ? preview : localized.description
  const copyDir = listingTextDir(
    `${localized.title} ${localized.address} ${localized.description}`,
  )

  return (
    <div className={`${classPrefix}__body`} dir={copyDir}>
      <p className={`${classPrefix}__neighborhood`}>{neighborhoodLabel}</p>
      <h3
        className={`${classPrefix}__title listing-copy`}
        dir={listingTextDir(localized.title)}
      >
        {localized.title}
      </h3>
      <p
        className={`${classPrefix}__address listing-copy`}
        dir={listingTextDir(localized.address)}
      >
        {localized.address}
      </p>

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

      <p
        className={`${classPrefix}__description ${classPrefix}__description--formatted listing-copy`}
        dir={listingTextDir(localized.description)}
      >
        {description}
      </p>
      {collapseDescription && truncated && (
        <button
          type="button"
          className={`${classPrefix}__show-more`}
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? t.property.showLess : t.property.showMore}
        </button>
      )}

      <div className={`${classPrefix}__footer`}>
        <Link to={detailPath} className={`${classPrefix}__link`}>
          {t.property.viewDetails}
        </Link>
      </div>
    </div>
  )
}

import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { getLocalizedProperty } from '../../../i18n/propertyTranslations'
import { splitListingNarrative } from '../../../lib/listingNarrative'
import { getActivePropertyFeatures, getPropertySpecParts } from '../../../lib/propertySummary'
import { listingTextDir } from '../../../utils/listingCopy'
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
  const specs = getPropertySpecParts(property, t)
  const features = getActivePropertyFeatures(property, t)
  const excerpt = splitListingNarrative(localized.description).intro
  const detailPath = getPropertyDetailPath(property)

  return (
    <div className={`${classPrefix}__body`} dir={listingTextDir(localized.title)}>
      <p className={`${classPrefix}__price`}>{localized.price ?? property.price}</p>
      <p className={`${classPrefix}__neighborhood`}>{neighborhoodLabel}</p>

      <div className={`${classPrefix}__specs`}>
        {specs.map((part, index) => (
          <Fragment key={part}>
            {index > 0 ? (
              <span className={`${classPrefix}__spec-divider`} aria-hidden="true" />
            ) : null}
            <span>{part}</span>
          </Fragment>
        ))}
      </div>

      {features.length > 0 ? (
        <p className={`${classPrefix}__features`}>{features.join(' · ')}</p>
      ) : null}

      {excerpt ? (
        <p
          className={`${classPrefix}__excerpt listing-copy`}
          dir={listingTextDir(excerpt)}
        >
          {excerpt}
        </p>
      ) : null}

      <Link to={detailPath} className={`${classPrefix}__details site-cta`}>
        {t.property.viewDetails}
      </Link>
    </div>
  )
}

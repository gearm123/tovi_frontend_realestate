import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { getLocalizedProperty } from '../../i18n/propertyTranslations'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import MapPinFacts from './MapPinFacts'

interface PropertyMapPinCardProps {
  pin: PropertyMapPin
  content: MapSectionContent
  neighborhoodLabel: (key: string) => string
  listingLabel: (pin: PropertyMapPin) => string
  classPrefix: 'placeholder-map__popup' | 'google-property-map__info'
}

export default function PropertyMapPinCard({
  pin,
  content,
  neighborhoodLabel,
  listingLabel,
  classPrefix,
}: PropertyMapPinCardProps) {
  const { locale } = useLanguage()
  const localized = getLocalizedProperty(pin.id, locale, {
    title: pin.title,
    address: pin.neighborhood,
    description: pin.title,
    price: pin.price,
    neighborhood: pin.neighborhood,
  })
  const displayPin = { ...pin, price: localized.price ?? pin.price }

  return (
    <>
      {pin.image ? (
        <img src={pin.image} alt="" className={`${classPrefix}-image`} />
      ) : null}
      <p className={`${classPrefix}-type`}>{listingLabel(pin)}</p>
      <MapPinFacts
        pin={displayPin}
        neighborhoodLabel={neighborhoodLabel}
        classPrefix={classPrefix}
      />
      {pin.positionSource === 'neighborhood' ? (
        <p className={`${classPrefix}-note`}>{content.neighborhoodFallback}</p>
      ) : null}
      <Link to={pin.href} className={`${classPrefix}-link site-cta site-cta--solid`}>
        {content.viewProperty}
      </Link>
    </>
  )
}

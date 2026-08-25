import { useLanguage } from '../../context/LanguageContext'
import { getPropertySpecParts } from '../../lib/propertySummary'
import type { PropertyMapPin } from '../../types/map'

interface MapPinFactsProps {
  pin: PropertyMapPin
  neighborhoodLabel: (key: string) => string
  classPrefix: 'placeholder-map__popup' | 'google-property-map__info'
}

export default function MapPinFacts({
  pin,
  neighborhoodLabel,
  classPrefix,
}: MapPinFactsProps) {
  const { t } = useLanguage()
  const specs = getPropertySpecParts(pin, t)

  return (
    <>
      <p className={`${classPrefix}-price`}>{pin.price}</p>
      <p className={`${classPrefix}-neighborhood`}>{neighborhoodLabel(pin.neighborhood)}</p>
      <p className={`${classPrefix}-specs`}>{specs.join(' · ')}</p>
    </>
  )
}

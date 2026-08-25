import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import './PropertyFacts.css'

interface PropertyFactsProps {
  property: Property
  floor?: string
}

export default function PropertyFacts({ property, floor }: PropertyFactsProps) {
  const { t } = useLanguage()
  const yes = t.property.yes
  const no = t.property.no
  const safeRoom = property.features.mamad
    ? yes
    : property.features.miklat
      ? t.property.buildingShelter
      : no

  const primary = [
    { label: 'm²', value: String(property.area), unit: true },
    { label: t.property.rooms, value: String(property.rooms) },
    { label: t.property.bedrooms, value: String(property.bedrooms) },
    { label: t.property.bathrooms, value: String(property.bathrooms) },
  ]

  const features = [
    { label: t.filters.features.parking, value: property.features.parking ? yes : no },
    { label: t.filters.features.elevator, value: property.features.elevator ? yes : no },
    { label: t.filters.features.balcony, value: property.features.balcony ? yes : no },
    { label: t.property.safeRoom, value: safeRoom },
    { label: t.filters.features.petsAllowed, value: property.features.petsAllowed ? yes : no },
    { label: t.property.floor, value: floor || no },
  ]

  return (
    <div className="property-facts">
      <div className="property-facts__row">
        {primary.map((fact) => (
          <div key={fact.label} className="property-facts__item">
            <span className="property-facts__value">{fact.value}</span>
            <span
              className={
                fact.unit ? 'property-facts__label property-facts__label--unit' : 'property-facts__label'
              }
            >
              {fact.label}
            </span>
          </div>
        ))}
      </div>
      <div className="property-facts__row property-facts__row--features">
        {features.map((fact) => (
          <div key={fact.label} className="property-facts__item">
            <span className="property-facts__value property-facts__value--small">{fact.value}</span>
            <span className="property-facts__label">{fact.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

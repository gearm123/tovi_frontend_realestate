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

  const primary = [
    { label: 'm²', value: String(property.area), unit: true },
    { label: t.property.rooms, value: String(property.rooms) },
    { label: t.property.bedrooms, value: String(property.bedrooms) },
    { label: t.property.bathrooms, value: String(property.bathrooms) },
  ]

  const features = [
    property.features.parking && { label: t.filters.features.parking, value: yes },
    property.features.elevator && { label: t.filters.features.elevator, value: yes },
    property.features.balcony && { label: t.filters.features.balcony, value: yes },
    property.features.mamad && { label: t.property.safeRoom, value: yes },
    !property.features.mamad &&
      property.features.miklat && { label: t.property.buildingShelter, value: yes },
    property.features.petsAllowed && { label: t.filters.features.petsAllowed, value: yes },
    floor ? { label: t.property.floor, value: floor } : null,
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact))

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
      {features.length > 0 ? (
        <div className="property-facts__row property-facts__row--features">
          {features.map((fact) => (
            <div key={fact.label} className="property-facts__item">
              <span className="property-facts__value property-facts__value--small">{fact.value}</span>
              <span className="property-facts__label">{fact.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

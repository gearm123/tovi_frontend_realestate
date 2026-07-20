import { useMemo } from 'react'
import { useSiteContent } from '../../hooks/useSiteContent'
import { useSiteData } from '../../hooks/useSiteData'
import { buildPropertyMapPins } from '../../services/mapService'
import type { Property } from '../../types/property'
import PropertyMap from './PropertyMap'
import './PropertyMapSection.css'

interface PropertyMapSectionProps {
  properties?: Property[]
  id?: string
}

export default function PropertyMapSection({
  properties,
  id = 'property-map',
}: PropertyMapSectionProps) {
  const { content } = useSiteContent()
  const { properties: allProperties } = useSiteData()
  const { mapSection } = content

  const pins = useMemo(
    () => buildPropertyMapPins(properties ?? allProperties),
    [properties, allProperties],
  )

  if (pins.length === 0) return null

  return (
    <section id={id} className="property-map-section" aria-labelledby="property-map-title">
      <div className="property-map-section__inner">
        <header className="property-map-section__header">
          {mapSection.accent && (
            <p className="property-map-section__accent orange-cursive-title orange-cursive-title--subtitle">
              {mapSection.accent}
            </p>
          )}
          <h2 id="property-map-title" className="property-map-section__title">
            {mapSection.title}
          </h2>
          {mapSection.subtitle && (
            <p className="property-map-section__subtitle">{mapSection.subtitle}</p>
          )}
        </header>

        <PropertyMap pins={pins} content={mapSection} />
      </div>
    </section>
  )
}

import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import { useViewport } from '../../../hooks/useViewport'
import DesktopPropertyCard from '../desktop/DesktopPropertyCard'
import MobilePropertyCard from '../mobile/MobilePropertyCard'
import './SimilarProperties.css'

interface SimilarPropertiesProps {
  properties: Property[]
}

export default function SimilarProperties({ properties }: SimilarPropertiesProps) {
  const { t } = useLanguage()
  const viewport = useViewport()
  if (properties.length === 0) return null

  return (
    <section className="similar-properties" aria-labelledby="similar-properties-title">
      <h2 id="similar-properties-title" className="similar-properties__title">
        {t.property.similarTitle}
      </h2>
      <div className="similar-properties__stack">
        {properties.map((property, index) =>
          viewport === 'mobile' ? (
            <MobilePropertyCard key={property.id} property={property} index={index} />
          ) : (
            <DesktopPropertyCard key={property.id} property={property} index={index} />
          ),
        )}
      </div>
    </section>
  )
}

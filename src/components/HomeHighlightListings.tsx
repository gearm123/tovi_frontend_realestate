import { useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useSiteData } from '../hooks/useSiteData'
import { pickRandomProperties } from '../lib/pickRandomProperties'
import PropertyListings from './PropertyListings'
import './HomeHighlightListings.css'

const HIGHLIGHT_COUNT = 2

export default function HomeHighlightListings() {
  const { t } = useLanguage()
  const { properties } = useSiteData()
  const picks = useMemo(
    () => pickRandomProperties(properties, HIGHLIGHT_COUNT),
    [properties],
  )

  if (picks.length === 0) return null

  return (
    <div className="home-highlights">
      <PropertyListings
        properties={picks}
        sectionLabel={t.home.sectionLabel}
        title={t.home.title}
        showHeader={false}
        sectionId="home-highlights"
      />
    </div>
  )
}

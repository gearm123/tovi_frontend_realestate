import { useMemo } from 'react'
import type { ListingStatusFilter } from '../constants/propertySearch'
import { useLanguage } from '../context/LanguageContext'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { getAllProperties } from '../services/propertyService'
import PropertyFiltersBar from './PropertyFilters'
import PropertyListings from './PropertyListings'
import PropertySearchEmpty from './PropertySearchEmpty'
import './PropertySearchSection.css'

interface PropertySearchSectionProps {
  /** Override property source — defaults to all demo listings */
  source?: ReturnType<typeof getAllProperties>
  initialStatus?: ListingStatusFilter
  showListingsHeader?: boolean
  listingsTitle?: string
  listingsIntro?: string
  id?: string
}

export default function PropertySearchSection({
  source,
  initialStatus = 'all',
  showListingsHeader = false,
  listingsTitle,
  listingsIntro,
  id = 'property-search',
}: PropertySearchSectionProps) {
  const { t, format } = useLanguage()
  const catalog = useMemo(() => source ?? getAllProperties(), [source])
  const { filters, setFilters, filtered, resetFilters, setListingStatus } =
    usePropertyFilters(catalog, { initialStatus })

  const sectionLabel = format(t.search.resultsCount, { count: filtered.length })
  const title = listingsTitle ?? t.search.resultsTitle
  const intro = listingsIntro ?? t.search.resultsIntro

  return (
    <section id={id} className="property-search-section" aria-label={t.search.sectionAria}>
      <p className="property-search-section__demo-note">{t.search.demoListingsNote}</p>
      <PropertyFiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        onStatusChange={setListingStatus}
      />

      {filtered.length === 0 ? (
        <PropertySearchEmpty onReset={resetFilters} />
      ) : (
        <PropertyListings
          properties={filtered}
          sectionLabel={sectionLabel}
          title={title}
          intro={intro}
          showHeader={showListingsHeader}
        />
      )}
    </section>
  )
}

import { useEffect, useMemo, useState } from 'react'
import type { ListingStatusFilter } from '../constants/propertySearch'
import { useLanguage } from '../context/LanguageContext'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { useSiteData } from '../hooks/useSiteData'
import { countActiveFilters } from '../lib/propertySearch'
import type { Property } from '../types/property'
import PropertyFiltersBar from './PropertyFilters'
import PropertyListings from './PropertyListings'
import PropertySearchEmpty from './PropertySearchEmpty'
import './PropertySearchSection.css'

const SEARCH_PAGE_SIZE = 12

interface PropertySearchSectionProps {
  /** Override property source — defaults to all listings from the site data store */
  source?: Property[]
  initialStatus?: ListingStatusFilter
  showListingsHeader?: boolean
  listingsTitle?: string
  listingsIntro?: string
  id?: string
  variant?: 'full' | 'simple'
  prominence?: 'default' | 'hero'
}

export default function PropertySearchSection({
  source,
  initialStatus = 'all',
  showListingsHeader = false,
  listingsTitle,
  listingsIntro,
  id = 'property-search',
  variant = 'full',
  prominence = 'default',
}: PropertySearchSectionProps) {
  const { t, format } = useLanguage()
  const { properties } = useSiteData()
  const catalog = useMemo(() => {
    const items = source ?? properties
    return [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }, [source, properties])
  const { filters, setFilters, filtered, resetFilters, setListingStatus } =
    usePropertyFilters(catalog, { initialStatus })

  const activeFilterCount = countActiveFilters(filters)
  const isHomeHero = prominence === 'hero'
  const sectionLabel = format(t.search.resultsCount, { count: filtered.length })
  const title =
    listingsTitle ??
    (isHomeHero && activeFilterCount === 0 ? t.home.title : t.search.resultsTitle)
  const intro =
    listingsIntro ??
    (isHomeHero ? undefined : t.search.resultsIntro)
  const [visibleCount, setVisibleCount] = useState(SEARCH_PAGE_SIZE)
  const filterKey = `${filtered.length}:${filtered[0]?.id ?? ''}:${filtered[filtered.length - 1]?.id ?? ''}`

  useEffect(() => {
    setVisibleCount(SEARCH_PAGE_SIZE)
  }, [filterKey])

  const listed = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section
      id={id}
      className={[
        'property-search-section',
        isHomeHero ? 'property-search-section--hero' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={t.search.sectionAria}
    >
      {!isHomeHero && (
        <p className="property-search-section__demo-note">{t.search.demoListingsNote}</p>
      )}
      <PropertyFiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        onStatusChange={setListingStatus}
        variant={variant}
      />

      {filtered.length === 0 ? (
        <PropertySearchEmpty onReset={resetFilters} />
      ) : (
        <>
          <PropertyListings
            properties={listed}
            sectionLabel={
              isHomeHero && activeFilterCount === 0 ? t.home.sectionLabel : sectionLabel
            }
            title={title}
            intro={intro}
            showHeader={showListingsHeader}
          />
          {hasMore && (
            <div className="property-search-section__more">
              <button
                type="button"
                className="property-search-section__more-button"
                onClick={() => setVisibleCount((count) => count + SEARCH_PAGE_SIZE)}
              >
                {t.property.loadMore}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

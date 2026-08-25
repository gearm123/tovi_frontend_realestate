import { useEffect, useMemo, useState } from 'react'
import type { ListingStatusFilter } from '../constants/propertySearch'
import { useLanguage } from '../context/LanguageContext'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { useSiteContent } from '../hooks/useSiteContent'
import { useSiteData } from '../hooks/useSiteData'
import { buildPropertyMapPins } from '../services/mapService'
import type { Property } from '../types/property'
import PropertyFiltersBar from './PropertyFilters'
import PropertyListings from './PropertyListings'
import PropertyMap from './map/PropertyMap'
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
  const { content } = useSiteContent()
  const { properties } = useSiteData()
  const catalog = useMemo(() => {
    const items = source ?? properties
    return [...items].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }, [source, properties])
  const { filters, setFilters, filtered, resetFilters, setListingStatus } =
    usePropertyFilters(catalog, { initialStatus })

  const isHomeHero = prominence === 'hero'
  const showMapToggle = !isHomeHero
  const sectionLabel = format(t.search.resultsCount, { count: filtered.length })
  const title = listingsTitle ?? t.search.resultsTitle
  const intro = listingsIntro
  const [visibleCount, setVisibleCount] = useState(SEARCH_PAGE_SIZE)
  const filterKey = `${filtered.length}:${filtered[0]?.id ?? ''}:${filtered[filtered.length - 1]?.id ?? ''}`

  useEffect(() => {
    setVisibleCount(SEARCH_PAGE_SIZE)
  }, [filterKey])

  const listed = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const [view, setView] = useState<'list' | 'map'>('list')
  const [mapExpanded, setMapExpanded] = useState(false)
  const pins = useMemo(() => buildPropertyMapPins(filtered), [filtered])

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
      <PropertyFiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        onStatusChange={setListingStatus}
        variant={variant}
      />

      {showMapToggle ? (
        <div
          className="property-search-section__views"
          role="group"
          aria-label={t.search.viewToggleAria}
        >
          <button
            type="button"
            className={`property-search-section__view${view === 'list' ? ' property-search-section__view--active' : ''}`}
            aria-pressed={view === 'list'}
            onClick={() => {
              setView('list')
              setMapExpanded(false)
            }}
          >
            {t.search.showList}
          </button>
          <button
            type="button"
            className={`property-search-section__view${view === 'map' ? ' property-search-section__view--active' : ''}`}
            aria-pressed={view === 'map'}
            onClick={() => setView('map')}
          >
            {t.search.showMap}
          </button>
        </div>
      ) : null}

      {showMapToggle && view === 'map' ? (
        <PropertyMap
          pins={pins}
          content={content.mapSection}
          variant="page"
          expandable
          expanded={mapExpanded}
          onExpand={() => setMapExpanded(true)}
          onCollapse={() => setMapExpanded(false)}
          filterControls={
            mapExpanded ? (
              <PropertyFiltersBar
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                onStatusChange={setListingStatus}
                variant={variant}
                density="compact"
              />
            ) : undefined
          }
        />
      ) : filtered.length === 0 ? (
        <PropertySearchEmpty onReset={resetFilters} />
      ) : (
        <>
          <PropertyListings
            properties={listed}
            sectionLabel={sectionLabel}
            title={title}
            intro={intro}
            showHeader={showListingsHeader}
          />
          {hasMore && (
            <div className="property-search-section__more">
              <button
                type="button"
                className="property-search-section__more-button site-cta"
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

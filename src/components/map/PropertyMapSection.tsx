import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'
import { useSiteContent } from '../../hooks/useSiteContent'
import { useSiteData } from '../../hooks/useSiteData'
import { buildPropertyMapPins } from '../../services/mapService'
import type { ListingStatusFilter } from '../../constants/propertySearch'
import type { Property } from '../../types/property'
import PropertyFiltersBar from '../PropertyFilters'
import PropertyMap from './PropertyMap'
import './PropertyMapSection.css'

interface PropertyMapSectionProps {
  properties?: Property[]
  id?: string
}

const STATUS_OPTIONS: ListingStatusFilter[] = ['all', 'sale', 'rental']

export default function PropertyMapSection({
  properties,
  id = 'property-map',
}: PropertyMapSectionProps) {
  const { t } = useLanguage()
  const { content } = useSiteContent()
  const { properties: allProperties } = useSiteData()
  const { mapSection } = content
  const catalog = properties ?? allProperties
  const { filters, setFilters, filtered, resetFilters, setListingStatus } =
    usePropertyFilters(catalog)
  const [expanded, setExpanded] = useState(false)

  const neighborhoods = useMemo(
    () => [...new Set(catalog.map((property) => property.neighborhood))].sort(),
    [catalog],
  )
  const catalogPins = useMemo(() => buildPropertyMapPins(catalog), [catalog])
  const pins = useMemo(() => buildPropertyMapPins(filtered), [filtered])

  const neighborhoodLabel = (key: string) =>
    (t.neighborhoods as Record<string, string>)[key] ?? key

  const statusLabel = (status: ListingStatusFilter) => {
    if (status === 'sale') return mapSection.saleLabel
    if (status === 'rental') return mapSection.rentalLabel
    return t.filters.statusAll
  }

  if (catalogPins.length === 0) return null

  const quickFilters = (
    <div className="property-map-section__filters">
      <div className="placeholder-map__filters" role="group" aria-label={t.filters.status}>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            className={`placeholder-map__filter${filters.listingStatus === status ? ' placeholder-map__filter--active' : ''}`}
            aria-pressed={filters.listingStatus === status}
            onClick={() => setListingStatus(status)}
          >
            {statusLabel(status)}
          </button>
        ))}
      </div>
      <div
        className="placeholder-map__filters"
        role="group"
        aria-label={mapSection.allNeighborhoods}
      >
        <button
          type="button"
          className={`placeholder-map__filter${filters.neighborhood === '' ? ' placeholder-map__filter--active' : ''}`}
          aria-pressed={filters.neighborhood === ''}
          onClick={() => setFilters({ ...filters, neighborhood: '' })}
        >
          {mapSection.allNeighborhoods}
        </button>
        {neighborhoods.map((neighborhood) => (
          <button
            key={neighborhood}
            type="button"
            className={`placeholder-map__filter${filters.neighborhood === neighborhood ? ' placeholder-map__filter--active' : ''}`}
            aria-pressed={filters.neighborhood === neighborhood}
            onClick={() =>
              setFilters({
                ...filters,
                neighborhood:
                  filters.neighborhood === neighborhood ? '' : neighborhood,
              })
            }
          >
            {neighborhoodLabel(neighborhood)}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <section id={id} className="property-map-section" aria-labelledby="property-map-title">
      <div className="property-map-section__inner">
        <header className="property-map-section__header">
          <h2 id="property-map-title" className="property-map-section__title">
            {mapSection.title}
          </h2>
          {mapSection.subtitle ? (
            <p className="property-map-section__subtitle">{mapSection.subtitle}</p>
          ) : null}
        </header>

        <PropertyMap
          pins={pins}
          content={mapSection}
          expandable
          expanded={expanded}
          onExpand={() => setExpanded(true)}
          onCollapse={() => setExpanded(false)}
          expandTrigger="search"
          filterControls={
            expanded ? (
              <PropertyFiltersBar
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                onStatusChange={setListingStatus}
                variant="simple"
                density="compact"
              />
            ) : (
              quickFilters
            )
          }
        />
      </div>
    </section>
  )
}

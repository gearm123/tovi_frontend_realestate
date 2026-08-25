import { neighborhoods, propertyTypes } from '../services/propertyService'
import {
  getPriceMaxForStatus,
  getPriceStepForStatus,
  isRentalPriceContext,
  SIZE_MIN_OPTIONS,
  type ListingStatusFilter,
} from '../constants/propertySearch'
import { useLanguage } from '../context/LanguageContext'
import { NUMBER_FORMAT_LOCALES } from '../i18n/locales'
import { useViewport } from '../hooks/useViewport'
import type { PropertyFilters } from '../types/filters'
import './PropertyFilters.css'

interface PropertyFiltersBarProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  onReset: () => void
  onStatusChange?: (status: ListingStatusFilter) => void
  variant?: 'full' | 'simple'
}

const roomOptions = ['', '2', '3', '4', '5', '6'] as const

const featureKeys = [
  'balcony',
  'parking',
  'elevator',
  'mamad',
  'miklat',
  'petsAllowed',
] as const

const statusOptions: ListingStatusFilter[] = ['all', 'sale', 'rental']

export default function PropertyFiltersBar({
  filters,
  onChange,
  onReset,
  onStatusChange,
  variant = 'full',
}: PropertyFiltersBarProps) {
  const { t, format, locale } = useLanguage()
  const viewport = useViewport()
  const priceMax = getPriceMaxForStatus(filters.listingStatus)
  const priceStep = getPriceStepForStatus(filters.listingStatus)
  const isRental = isRentalPriceContext(filters.listingStatus)

  const update = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const handleStatus = (status: ListingStatusFilter) => {
    if (onStatusChange) {
      onStatusChange(status)
      return
    }
    const nextMax = getPriceMaxForStatus(status)
    onChange({
      ...filters,
      listingStatus: status,
      priceMax: Math.min(filters.priceMax, nextMax),
    })
  }

  const priceLabel = isRental
    ? t.filters.monthlyRent
    : filters.listingStatus === 'all'
      ? t.filters.priceOrRent
      : t.filters.price

  const neighborhoodLabel = (name: string) => {
    const labels = t.neighborhoods as Record<string, string>
    return labels[name] ?? name
  }

  const propertyTypeLabel = (value: string) => {
    const labels = t.propertyTypes as Record<string, string>
    return labels[value] ?? value
  }

  const statusLabel = (status: ListingStatusFilter) => {
    if (variant === 'simple') {
      const labels: Record<ListingStatusFilter, string> = {
        all: t.filters.statusAll,
        sale: t.filters.buy,
        rental: t.filters.rent,
      }
      return labels[status]
    }
    const labels: Record<ListingStatusFilter, string> = {
      all: t.filters.statusAll,
      sale: t.filters.statusSale,
      rental: t.filters.statusRent,
    }
    return labels[status]
  }

  const extrasContent = (
    <div className="property-filters__checkboxes">
      {featureKeys.map((key) => (
        <label key={key} className="property-filters__checkbox">
          <input
            type="checkbox"
            checked={filters[key]}
            onChange={(e) => update(key, e.target.checked)}
          />
          <span>{t.filters.features[key]}</span>
        </label>
      ))}
    </div>
  )

  return (
    <div
      className={`property-filters${variant === 'simple' ? ' property-filters--simple' : ''}`}
      role="search"
      aria-label={t.filters.aria}
    >
      <div className="property-filters__header">
        <p className="property-filters__title">
          {variant === 'simple' ? t.search.homeTitle : t.search.filterTitle}
        </p>
        <button type="button" className="property-filters__reset" onClick={onReset}>
          {t.filters.clear}
        </button>
      </div>

      {variant === 'simple' && (
        <p className="property-filters__lead">{t.search.homeSubtitle}</p>
      )}

      <fieldset className="property-filters__status">
        <legend className="property-filters__label">{t.filters.status}</legend>
        <div className="property-filters__status-options" role="group">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              className={`property-filters__status-btn${
                filters.listingStatus === status
                  ? ' property-filters__status-btn--active'
                  : ''
              }`}
              aria-pressed={filters.listingStatus === status}
              onClick={() => handleStatus(status)}
            >
              {statusLabel(status)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="property-filters__row">
        <label className="property-filters__field">
          <span className="property-filters__label">
            {variant === 'simple' ? t.filters.area : t.filters.neighborhood}
          </span>
          <select
            value={filters.neighborhood}
            onChange={(e) => update('neighborhood', e.target.value)}
          >
            <option value="">{t.filters.allNeighborhoods}</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {neighborhoodLabel(n)}
              </option>
            ))}
          </select>
        </label>

        {variant === 'full' && (
          <label className="property-filters__field">
            <span className="property-filters__label">{t.filters.propertyType}</span>
            <select
              value={filters.propertyType}
              onChange={(e) =>
                update('propertyType', e.target.value as PropertyFilters['propertyType'])
              }
            >
              <option value="">{t.filters.allTypes}</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {propertyTypeLabel(type.value)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="property-filters__field">
          <span className="property-filters__label">
            {variant === 'simple' ? t.filters.roomsBedrooms : t.filters.rooms}
          </span>
          <select
            value={filters.rooms === '' ? '' : String(filters.rooms)}
            onChange={(e) =>
              update('rooms', e.target.value === '' ? '' : Number(e.target.value))
            }
          >
            {roomOptions.map((r) => (
              <option key={r || 'any'} value={r}>
                {r === '' ? t.filters.any : format(t.filters.roomsPlus, { count: r })}
              </option>
            ))}
          </select>
        </label>

        <label className="property-filters__field">
          <span className="property-filters__label">{t.filters.size}</span>
          <select
            value={filters.sizeMin === '' ? '' : String(filters.sizeMin)}
            onChange={(e) =>
              update('sizeMin', e.target.value === '' ? '' : Number(e.target.value))
            }
          >
            <option value="">{t.filters.anySize}</option>
            {SIZE_MIN_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {format(t.filters.sizePlus, { count: size })}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="property-filters__row property-filters__row--price">
        <div className="property-filters__field property-filters__field--range">
          <span className="property-filters__label">
            {format(t.filters.priceRange, {
              label: priceLabel,
              min: filters.priceMin.toLocaleString(NUMBER_FORMAT_LOCALES[locale]),
              max: Math.min(filters.priceMax, priceMax).toLocaleString(
                NUMBER_FORMAT_LOCALES[locale],
              ),
            })}
          </span>
          <div className="property-filters__sliders">
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={Math.min(filters.priceMin, priceMax)}
              onChange={(e) => update('priceMin', Number(e.target.value))}
              aria-label={t.filters.minPrice}
            />
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={Math.min(filters.priceMax, priceMax)}
              onChange={(e) => update('priceMax', Number(e.target.value))}
              aria-label={t.filters.maxPrice}
            />
          </div>
        </div>
      </div>

      {variant === 'full' &&
        (viewport === 'mobile' ? (
        <details className="property-filters__extras-panel">
          <summary className="property-filters__label">{t.filters.extraFilters}</summary>
          {extrasContent}
        </details>
      ) : (
        <fieldset className="property-filters__extras">
          <legend className="property-filters__label">{t.filters.extraFilters}</legend>
          {extrasContent}
        </fieldset>
      ))}
    </div>
  )
}

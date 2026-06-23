import { neighborhoods, propertyTypes } from '../data/properties'
import { useLanguage } from '../context/LanguageContext'
import type { PropertyFilters } from '../types/filters'
import './PropertyFilters.css'

interface PropertyFiltersBarProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  onReset: () => void
  priceMax: number
  isRental?: boolean
}

const bedroomOptions = ['', '1', '2', '3', '4', '5'] as const

const featureKeys = [
  'balcony',
  'parking',
  'elevator',
  'mamad',
  'miklat',
  'petsAllowed',
] as const

export default function PropertyFiltersBar({
  filters,
  onChange,
  onReset,
  priceMax,
  isRental = false,
}: PropertyFiltersBarProps) {
  const { t, format, locale } = useLanguage()

  const update = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const priceStep = isRental ? 1000 : 100000
  const priceLabel = isRental ? t.filters.monthlyRent : t.filters.price

  const neighborhoodLabel = (name: string) => {
    const labels = t.neighborhoods as Record<string, string>
    return labels[name] ?? name
  }

  const propertyTypeLabel = (value: string) => {
    const labels = t.propertyTypes as Record<string, string>
    return labels[value] ?? value
  }

  return (
    <div className="property-filters" role="search" aria-label={t.filters.aria}>
      <div className="property-filters__row">
        <label className="property-filters__field">
          <span className="property-filters__label">{t.filters.neighborhood}</span>
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

        <label className="property-filters__field">
          <span className="property-filters__label">{t.filters.roomsBeds}</span>
          <select
            value={filters.bedrooms === '' ? '' : String(filters.bedrooms)}
            onChange={(e) =>
              update(
                'bedrooms',
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
          >
            {bedroomOptions.map((b) => (
              <option key={b || 'any'} value={b}>
                {b === '' ? t.filters.any : format(t.filters.roomsPlus, { count: b })}
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
              min: filters.priceMin.toLocaleString(locale === 'he' ? 'he-IL' : 'en-US'),
              max: filters.priceMax.toLocaleString(locale === 'he' ? 'he-IL' : 'en-US'),
            })}
          </span>
          <div className="property-filters__sliders">
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={filters.priceMin}
              onChange={(e) => update('priceMin', Number(e.target.value))}
              aria-label={t.filters.minPrice}
            />
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={filters.priceMax}
              onChange={(e) => update('priceMax', Number(e.target.value))}
              aria-label={t.filters.maxPrice}
            />
          </div>
        </div>
      </div>

      <fieldset className="property-filters__extras">
        <legend className="property-filters__label">{t.filters.extraFilters}</legend>
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
      </fieldset>

      <button type="button" className="property-filters__reset" onClick={onReset}>
        {t.filters.clear}
      </button>
    </div>
  )
}

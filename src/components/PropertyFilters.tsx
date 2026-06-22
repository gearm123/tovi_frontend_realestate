import { neighborhoods, propertyTypes } from '../data/properties'
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

const featureOptions = [
  { key: 'balcony' as const, label: 'Balcony' },
  { key: 'parking' as const, label: 'Parking' },
  { key: 'elevator' as const, label: 'Elevator' },
  { key: 'mamad' as const, label: 'Mamad' },
  { key: 'miklat' as const, label: 'Miklat' },
  { key: 'petsAllowed' as const, label: 'Pets allowed' },
]

export default function PropertyFiltersBar({
  filters,
  onChange,
  onReset,
  priceMax,
  isRental = false,
}: PropertyFiltersBarProps) {
  const update = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K],
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const priceStep = isRental ? 1000 : 100000
  const priceLabel = isRental ? 'Monthly rent' : 'Price'

  return (
    <div className="property-filters" role="search" aria-label="Property search filters">
      <div className="property-filters__row">
        <label className="property-filters__field">
          <span className="property-filters__label">Neighbourhood</span>
          <select
            value={filters.neighborhood}
            onChange={(e) => update('neighborhood', e.target.value)}
          >
            <option value="">All neighbourhoods</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="property-filters__field">
          <span className="property-filters__label">Property type</span>
          <select
            value={filters.propertyType}
            onChange={(e) =>
              update('propertyType', e.target.value as PropertyFilters['propertyType'])
            }
          >
            <option value="">All types</option>
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="property-filters__field">
          <span className="property-filters__label">Rooms / beds</span>
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
                {b === '' ? 'Any' : `${b}+`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="property-filters__row property-filters__row--price">
        <div className="property-filters__field property-filters__field--range">
          <span className="property-filters__label">
            {priceLabel}: ₪{filters.priceMin.toLocaleString()} – ₪
            {filters.priceMax.toLocaleString()}
          </span>
          <div className="property-filters__sliders">
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={filters.priceMin}
              onChange={(e) => update('priceMin', Number(e.target.value))}
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={0}
              max={priceMax}
              step={priceStep}
              value={filters.priceMax}
              onChange={(e) => update('priceMax', Number(e.target.value))}
              aria-label="Maximum price"
            />
          </div>
        </div>
      </div>

      <fieldset className="property-filters__extras">
        <legend className="property-filters__label">Extra filters</legend>
        <div className="property-filters__checkboxes">
          {featureOptions.map(({ key, label }) => (
            <label key={key} className="property-filters__checkbox">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => update(key, e.target.checked)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="button" className="property-filters__reset" onClick={onReset}>
        Clear filters
      </button>
    </div>
  )
}

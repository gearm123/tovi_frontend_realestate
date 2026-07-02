import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { latLngToMapPercent } from '../../services/mapService'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import './PlaceholderPropertyMap.css'

interface PlaceholderPropertyMapProps {
  pins: PropertyMapPin[]
  content: MapSectionContent
}

export default function PlaceholderPropertyMap({
  pins,
  content,
}: PlaceholderPropertyMapProps) {
  const { t, format } = useLanguage()
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('all')
  const [activePinId, setActivePinId] = useState<string | null>(null)

  const neighborhoods = useMemo(
    () => [...new Set(pins.map((pin) => pin.neighborhood))].sort(),
    [pins],
  )

  const visiblePins = useMemo(
    () =>
      activeNeighborhood === 'all'
        ? pins
        : pins.filter((pin) => pin.neighborhood === activeNeighborhood),
    [activeNeighborhood, pins],
  )

  const activePin = visiblePins.find((pin) => pin.id === activePinId) ?? null

  const neighborhoodLabel = (key: string) =>
    (t.neighborhoods as Record<string, string>)[key] ?? key

  const listingLabel = (pin: PropertyMapPin) =>
    pin.listingType === 'sale' ? content.saleLabel : content.rentalLabel

  return (
    <div className="placeholder-map">
      <div className="placeholder-map__filters" role="group" aria-label={content.allNeighborhoods}>
        <button
          type="button"
          className={`placeholder-map__filter${activeNeighborhood === 'all' ? ' placeholder-map__filter--active' : ''}`}
          onClick={() => {
            setActiveNeighborhood('all')
            setActivePinId(null)
          }}
        >
          {content.allNeighborhoods}
        </button>
        {neighborhoods.map((neighborhood) => (
          <button
            key={neighborhood}
            type="button"
            className={`placeholder-map__filter${activeNeighborhood === neighborhood ? ' placeholder-map__filter--active' : ''}`}
            onClick={() => {
              setActiveNeighborhood(neighborhood)
              setActivePinId(null)
            }}
          >
            {neighborhoodLabel(neighborhood)}
          </button>
        ))}
      </div>

      <div className="placeholder-map__layout">
        <div className="placeholder-map__canvas-wrap">
          <div className="placeholder-map__canvas" aria-label={content.title}>
            <div className="placeholder-map__sea" aria-hidden="true" />
            <div className="placeholder-map__grid" aria-hidden="true" />
            <div className="placeholder-map__coastline" aria-hidden="true" />

            {visiblePins.map((pin) => {
              const point = latLngToMapPercent(pin.lat, pin.lng)
              const isActive = pin.id === activePinId

              return (
                <button
                  key={pin.id}
                  type="button"
                  className={`placeholder-map__pin placeholder-map__pin--${pin.listingType}${isActive ? ' placeholder-map__pin--active' : ''}`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-label={`${pin.title}, ${neighborhoodLabel(pin.neighborhood)}`}
                  aria-pressed={isActive}
                  onClick={() => setActivePinId(isActive ? null : pin.id)}
                >
                  <span className="placeholder-map__pin-dot" aria-hidden="true" />
                </button>
              )
            })}

            {activePin && (
              <div
                className="placeholder-map__popup"
                style={{
                  left: `${latLngToMapPercent(activePin.lat, activePin.lng).x}%`,
                  top: `${latLngToMapPercent(activePin.lat, activePin.lng).y}%`,
                }}
              >
                <p className="placeholder-map__popup-type">{listingLabel(activePin)}</p>
                <h3 className="placeholder-map__popup-title">{activePin.title}</h3>
                <p className="placeholder-map__popup-neighborhood">
                  {neighborhoodLabel(activePin.neighborhood)}
                </p>
                <p className="placeholder-map__popup-price">{activePin.price}</p>
                {activePin.positionSource === 'neighborhood' && (
                  <p className="placeholder-map__popup-note">{content.neighborhoodFallback}</p>
                )}
                <Link to={activePin.href} className="placeholder-map__popup-link">
                  {content.viewProperty}
                </Link>
              </div>
            )}
          </div>

          <p className="placeholder-map__note">{content.placeholderNote}</p>
        </div>

        <aside className="placeholder-map__list" aria-label={content.title}>
          <p className="placeholder-map__list-count">
            {format(content.listingsCount, { count: visiblePins.length })}
          </p>
          <ul>
            {visiblePins.map((pin) => (
              <li key={pin.id}>
                <button
                  type="button"
                  className={`placeholder-map__list-item${pin.id === activePinId ? ' placeholder-map__list-item--active' : ''}`}
                  onClick={() => setActivePinId(pin.id === activePinId ? null : pin.id)}
                >
                  <span className={`placeholder-map__list-type placeholder-map__list-type--${pin.listingType}`}>
                    {listingLabel(pin)}
                  </span>
                  <span className="placeholder-map__list-title">{pin.title}</span>
                  <span className="placeholder-map__list-meta">
                    {neighborhoodLabel(pin.neighborhood)} · {pin.price}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

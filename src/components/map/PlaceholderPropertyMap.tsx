import { latLngToMapPercent } from '../../services/mapService'
import type { PropertyMapProps } from './PropertyMap'
import PropertyMapPinCard from './PropertyMapPinCard'
import PropertyMapShell from './PropertyMapShell'
import './PlaceholderPropertyMap.css'

export default function PlaceholderPropertyMap(props: PropertyMapProps) {
  const { content } = props

  return (
    <PropertyMapShell
      {...props}
      canvasNote={<p className="placeholder-map__note">{content.placeholderNote}</p>}
    >
      {({ pins: visiblePins, activePinId, onPinSelect, neighborhoodLabel, listingLabel }) => {
        const activePin = visiblePins.find((pin) => pin.id === activePinId) ?? null

        return (
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
                  aria-label={`${listingLabel(pin)}, ${neighborhoodLabel(pin.neighborhood)}`}
                  aria-pressed={isActive}
                  onClick={() => onPinSelect(isActive ? null : pin.id)}
                >
                  <span className="placeholder-map__pin-dot" aria-hidden="true" />
                </button>
              )
            })}

            {activePin ? (
              <div
                className="placeholder-map__popup"
                style={{
                  left: `${latLngToMapPercent(activePin.lat, activePin.lng).x}%`,
                  top: `${latLngToMapPercent(activePin.lat, activePin.lng).y}%`,
                }}
              >
                <PropertyMapPinCard
                  pin={activePin}
                  content={content}
                  neighborhoodLabel={neighborhoodLabel}
                  listingLabel={listingLabel}
                  classPrefix="placeholder-map__popup"
                />
              </div>
            ) : null}
          </div>
        )
      }}
    </PropertyMapShell>
  )
}

import { useCallback, useMemo, useState } from 'react'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../hooks/useSiteContent'
import { getMapCredentials } from '../../constants/mapConfig'
import {
  buildPropertyMapPins,
  getActiveMapProvider,
  getExternalMapsUrl,
  latLngToMapPercent,
} from '../../services/mapService'
import type { Property } from '../../types/property'
import type { PropertyMapPin } from '../../types/map'
import './PlaceholderPropertyMap.css'
import './GooglePropertyMap.css'
import './PropertyLocationMap.css'

interface PropertyLocationMapProps {
  property: Property
}

function LocationPin() {
  return (
    <svg viewBox="0 0 24 36" className="property-location-map__marker-icon" aria-hidden="true">
      <path
        fill="#f05a24"
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
      />
      <circle cx="12" cy="12" r="4.5" fill="#fff" />
    </svg>
  )
}

function PlaceholderLocationCanvas({ pin }: { pin: PropertyMapPin }) {
  const point = latLngToMapPercent(pin.lat, pin.lng)

  return (
    <div className="property-location-map__canvas placeholder-map__canvas">
      <div className="placeholder-map__sea" aria-hidden="true" />
      <div className="placeholder-map__grid" aria-hidden="true" />
      <div className="placeholder-map__coastline" aria-hidden="true" />
      <span
        className="property-location-map__geo-pin"
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
      >
        <LocationPin />
      </span>
    </div>
  )
}

function GoogleLocationCanvas({
  pin,
  onError,
}: {
  pin: PropertyMapPin
  onError: () => void
}) {
  const zoom = pin.positionSource === 'coordinates' ? 16 : 14

  return (
    <APIProvider apiKey={getMapCredentials().googleMapsApiKey ?? ''} onError={onError}>
      <Map
        className="property-location-map__google google-property-map__canvas"
        defaultCenter={{ lat: pin.lat, lng: pin.lng }}
        defaultZoom={zoom}
        gestureHandling="none"
        disableDefaultUI
        keyboardShortcuts={false}
        draggable={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl={false}
        clickableIcons={false}
      />
    </APIProvider>
  )
}

export default function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  const { t } = useLanguage()
  const { content } = useSiteContent()
  const [googleFailed, setGoogleFailed] = useState(false)
  const pin = useMemo(() => buildPropertyMapPins([property])[0], [property])
  const handleGoogleError = useCallback(() => setGoogleFailed(true), [])

  if (!pin) return null

  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[pin.neighborhood] ?? pin.neighborhood
  const mapsUrl = getExternalMapsUrl(pin.lat, pin.lng, pin.address || pin.title)
  const live = getActiveMapProvider() === 'google' && !googleFailed

  return (
    <section className="property-location-map" aria-labelledby="property-location-title">
      <h2 id="property-location-title">{t.map.locationTitle}</h2>
      <p className="property-location-map__area">{neighborhoodLabel}</p>
      <a
        className="property-location-map__preview"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.map.openInMaps}
      >
        <div className="property-location-map__surface">
          {live ? (
            <GoogleLocationCanvas pin={pin} onError={handleGoogleError} />
          ) : (
            <PlaceholderLocationCanvas pin={pin} />
          )}
        </div>
        {live ? (
          <span className="property-location-map__marker">
            <LocationPin />
          </span>
        ) : null}
      </a>
      {pin.positionSource === 'neighborhood' ? (
        <p className="property-location-map__note">{content.mapSection.neighborhoodFallback}</p>
      ) : null}
    </section>
  )
}

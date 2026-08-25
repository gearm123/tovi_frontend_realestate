import { useCallback, useMemo, useState } from 'react'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
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

function locationMarkerIcon(pin: PropertyMapPin): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 11,
    fillColor: pin.listingType === 'sale' ? '#1c1c1c' : '#f05a24',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
  }
}

function PlaceholderLocationCanvas({ pin, label }: { pin: PropertyMapPin; label: string }) {
  const point = latLngToMapPercent(pin.lat, pin.lng)

  return (
    <div className="property-location-map__canvas placeholder-map__canvas" aria-label={label}>
      <div className="placeholder-map__sea" aria-hidden="true" />
      <div className="placeholder-map__grid" aria-hidden="true" />
      <div className="placeholder-map__coastline" aria-hidden="true" />
      <span
        className={`placeholder-map__pin placeholder-map__pin--${pin.listingType} placeholder-map__pin--active property-location-map__pin`}
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
        aria-hidden="true"
      >
        <span className="placeholder-map__pin-dot" />
      </span>
    </div>
  )
}

function GoogleLocationCanvas({ pin, label }: { pin: PropertyMapPin; label: string }) {
  const { t } = useLanguage()
  const apiKey = getMapCredentials().googleMapsApiKey ?? ''
  const [loadFailed, setLoadFailed] = useState(false)
  const zoom = pin.positionSource === 'coordinates' ? 16 : 14

  const handleApiError = useCallback((error: unknown) => {
    console.error('Google Maps failed to load:', error)
    setLoadFailed(true)
  }, [])

  if (!apiKey || loadFailed) {
    return (
      <>
        {loadFailed ? (
          <p className="property-location-map__fallback">{t.map.loadErrorTitle}</p>
        ) : null}
        <PlaceholderLocationCanvas pin={pin} label={label} />
      </>
    )
  }

  return (
    <APIProvider apiKey={apiKey} onError={handleApiError}>
      <div className="property-location-map__google-wrap" aria-label={label}>
        <Map
          className="property-location-map__google google-property-map__canvas"
          defaultCenter={{ lat: pin.lat, lng: pin.lng }}
          defaultZoom={zoom}
          gestureHandling="cooperative"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons={false}
        >
          <Marker
            position={{ lat: pin.lat, lng: pin.lng }}
            title={pin.title}
            icon={locationMarkerIcon(pin)}
          />
        </Map>
      </div>
    </APIProvider>
  )
}

export default function PropertyLocationMap({ property }: PropertyLocationMapProps) {
  const { t } = useLanguage()
  const { content } = useSiteContent()
  const pin = useMemo(() => buildPropertyMapPins([property])[0], [property])

  if (!pin) return null

  const neighborhoodLabel =
    (t.neighborhoods as Record<string, string>)[pin.neighborhood] ?? pin.neighborhood
  const mapsUrl = getExternalMapsUrl(pin.lat, pin.lng, pin.address || pin.title)
  const live = getActiveMapProvider() === 'google'

  return (
    <section className="property-location-map" aria-labelledby="property-location-title">
      <h2 id="property-location-title">{t.map.locationTitle}</h2>
      <p className="property-location-map__area">{neighborhoodLabel}</p>
      {live ? (
        <GoogleLocationCanvas pin={pin} label={t.map.locationTitle} />
      ) : (
        <PlaceholderLocationCanvas pin={pin} label={t.map.locationTitle} />
      )}
      {pin.positionSource === 'neighborhood' ? (
        <p className="property-location-map__note">{content.mapSection.neighborhoodFallback}</p>
      ) : null}
      <a
        className="property-location-map__link"
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        {t.map.openInMaps}
      </a>
    </section>
  )
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMap,
} from '@vis.gl/react-google-maps'
import { useLanguage } from '../../context/LanguageContext'
import { MAP_CONFIG, getMapCredentials } from '../../constants/mapConfig'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import PlaceholderPropertyMap from './PlaceholderPropertyMap'
import './GooglePropertyMap.css'
import './PlaceholderPropertyMap.css'

interface GooglePropertyMapProps {
  pins: PropertyMapPin[]
  content: MapSectionContent
}

interface MapPinsLayerProps {
  pins: PropertyMapPin[]
  activePinId: string | null
  onPinSelect: (id: string | null) => void
  content: MapSectionContent
  neighborhoodLabel: (key: string) => string
  listingLabel: (pin: PropertyMapPin) => string
}

function markerIcon(pin: PropertyMapPin, isActive: boolean): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: isActive ? 11 : 9,
    fillColor: pin.listingType === 'sale' ? '#1c1c1c' : '#f05a24',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
  }
}

function MapPinsLayer({
  pins,
  activePinId,
  onPinSelect,
  content,
  neighborhoodLabel,
  listingLabel,
}: MapPinsLayerProps) {
  const map = useMap()
  const activePin = pins.find((pin) => pin.id === activePinId) ?? null

  useEffect(() => {
    if (!map || pins.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    pins.forEach((pin) => bounds.extend({ lat: pin.lat, lng: pin.lng }))
    map.fitBounds(bounds, pins.length === 1 ? 48 : 56)
  }, [map, pins])

  return (
    <>
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={{ lat: pin.lat, lng: pin.lng }}
          title={pin.title}
          onClick={() => onPinSelect(pin.id === activePinId ? null : pin.id)}
          icon={markerIcon(pin, pin.id === activePinId)}
        />
      ))}

      {activePin && (
        <InfoWindow
          position={{ lat: activePin.lat, lng: activePin.lng }}
          onCloseClick={() => onPinSelect(null)}
        >
          <div className="google-property-map__info">
            <p className="google-property-map__info-type">{listingLabel(activePin)}</p>
            <h3 className="google-property-map__info-title">{activePin.title}</h3>
            <p className="google-property-map__info-neighborhood">
              {neighborhoodLabel(activePin.neighborhood)}
            </p>
            <p className="google-property-map__info-price">{activePin.price}</p>
            {activePin.positionSource === 'neighborhood' && (
              <p className="google-property-map__info-note">{content.neighborhoodFallback}</p>
            )}
            <Link
              to={activePin.href}
              className="google-property-map__info-link"
              onClick={() => onPinSelect(null)}
            >
              {content.viewProperty}
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

function GooglePropertyMapShell({ pins, content }: GooglePropertyMapProps) {
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

  const neighborhoodLabel = (key: string) =>
    (t.neighborhoods as Record<string, string>)[key] ?? key

  const listingLabel = (pin: PropertyMapPin) =>
    pin.listingType === 'sale' ? content.saleLabel : content.rentalLabel

  return (
    <div className="google-property-map placeholder-map">
      <div
        className="placeholder-map__filters"
        role="group"
        aria-label={content.allNeighborhoods}
      >
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
        <div className="google-property-map__canvas-wrap placeholder-map__canvas-wrap">
          <Map
            className="google-property-map__canvas"
            defaultCenter={MAP_CONFIG.defaultViewport.center}
            defaultZoom={MAP_CONFIG.defaultViewport.zoom}
            gestureHandling="cooperative"
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl
            clickableIcons={false}
          >
            <MapPinsLayer
              pins={visiblePins}
              activePinId={activePinId}
              onPinSelect={setActivePinId}
              content={content}
              neighborhoodLabel={neighborhoodLabel}
              listingLabel={listingLabel}
            />
          </Map>
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
                  <span
                    className={`placeholder-map__list-type placeholder-map__list-type--${pin.listingType}`}
                  >
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

export default function GooglePropertyMap({ pins, content }: GooglePropertyMapProps) {
  const { t } = useLanguage()
  const apiKey = getMapCredentials().googleMapsApiKey ?? ''
  const [loadFailed, setLoadFailed] = useState(false)

  const handleApiError = useCallback((error: unknown) => {
    console.error('Google Maps failed to load:', error)
    setLoadFailed(true)
  }, [])

  if (!apiKey) {
    return <PlaceholderPropertyMap pins={pins} content={content} />
  }

  if (loadFailed) {
    return (
      <div className="google-property-map__fallback">
        <div className="google-property-map__fallback-message" role="alert">
          <h3>{t.map.loadErrorTitle}</h3>
          <p>{t.map.loadErrorBody}</p>
          <ul>
            <li>{t.map.loadErrorBilling}</li>
            <li>{t.map.loadErrorApi}</li>
            <li>{t.map.loadErrorReferrer}</li>
          </ul>
        </div>
        <PlaceholderPropertyMap pins={pins} content={content} />
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey} onError={handleApiError}>
      <GooglePropertyMapShell pins={pins} content={content} />
    </APIProvider>
  )
}

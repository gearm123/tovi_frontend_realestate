import { useCallback, useEffect, useState } from 'react'
import {
  APIProvider,
  ControlPosition,
  InfoWindow,
  Map,
  MapControl,
  Marker,
  useMap,
} from '@vis.gl/react-google-maps'
import { useLanguage } from '../../context/LanguageContext'
import { MAP_CONFIG, getMapCredentials } from '../../constants/mapConfig'
import type { PropertyMapPin } from '../../types/map'
import PlaceholderPropertyMap from './PlaceholderPropertyMap'
import PropertyMapPinCard from './PropertyMapPinCard'
import PropertyMapShell, {
  type PropertyMapCanvasContext,
} from './PropertyMapShell'
import type { PropertyMapProps } from './PropertyMap'
import './GooglePropertyMap.css'
import './PlaceholderPropertyMap.css'

interface MapPinsLayerProps extends PropertyMapCanvasContext {
  content: PropertyMapProps['content']
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
  expanded,
  content,
  neighborhoodLabel,
  listingLabel,
}: MapPinsLayerProps) {
  const map = useMap()
  const activePin = pins.find((pin) => pin.id === activePinId) ?? null

  useEffect(() => {
    if (!map) return
    google.maps.event.trigger(map, 'resize')
  }, [map, expanded])

  useEffect(() => {
    if (!map || pins.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    pins.forEach((pin) => bounds.extend({ lat: pin.lat, lng: pin.lng }))
    map.fitBounds(bounds, pins.length === 1 ? 48 : 56)
  }, [map, pins, expanded])

  useEffect(() => {
    if (!map || !activePin) return
    map.panTo({ lat: activePin.lat, lng: activePin.lng })
  }, [map, activePin])

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
            <PropertyMapPinCard
              pin={activePin}
              content={content}
              neighborhoodLabel={neighborhoodLabel}
              listingLabel={listingLabel}
              classPrefix="google-property-map__info"
            />
          </div>
        </InfoWindow>
      )}
    </>
  )
}

function GooglePropertyMapShell(props: PropertyMapProps) {
  const { content, expanded } = props
  const { dir } = useLanguage()
  const searchPosition =
    dir === 'rtl' ? ControlPosition.TOP_RIGHT : ControlPosition.TOP_LEFT

  return (
    <PropertyMapShell {...props}>
      {(ctx) => (
        <Map
          className="google-property-map__canvas"
          defaultCenter={MAP_CONFIG.defaultViewport.center}
          defaultZoom={MAP_CONFIG.defaultViewport.zoom}
          gestureHandling={expanded ? 'greedy' : 'cooperative'}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons={false}
          keyboardShortcuts={false}
        >
          <MapPinsLayer {...ctx} content={content} />
          {ctx.searchBar ? (
            <MapControl position={searchPosition}>{ctx.searchBar}</MapControl>
          ) : null}
        </Map>
      )}
    </PropertyMapShell>
  )
}

export default function GooglePropertyMap(props: PropertyMapProps) {
  const { t } = useLanguage()
  const apiKey = getMapCredentials().googleMapsApiKey ?? ''
  const [loadFailed, setLoadFailed] = useState(false)

  const handleApiError = useCallback((error: unknown) => {
    console.error('Google Maps failed to load:', error)
    setLoadFailed(true)
  }, [])

  if (!apiKey) {
    return <PlaceholderPropertyMap {...props} />
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
        <PlaceholderPropertyMap {...props} />
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey} onError={handleApiError}>
      <GooglePropertyMapShell {...props} />
    </APIProvider>
  )
}

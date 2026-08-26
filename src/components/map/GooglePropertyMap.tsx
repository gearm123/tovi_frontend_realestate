import { useCallback, useEffect, useState } from 'react'
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMap,
} from '@vis.gl/react-google-maps'
import { useLanguage } from '../../context/LanguageContext'
import { useViewport } from '../../hooks/useViewport'
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
  showInfoWindow?: boolean
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
  showInfoWindow = true,
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

      {activePin && showInfoWindow ? (
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
      ) : null}
    </>
  )
}

function MobileMapPinSheet({
  pin,
  content,
  neighborhoodLabel,
  listingLabel,
  onClose,
}: {
  pin: PropertyMapPin
  content: PropertyMapProps['content']
  neighborhoodLabel: (key: string) => string
  listingLabel: (pin: PropertyMapPin) => string
  onClose: () => void
}) {
  const { t } = useLanguage()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="google-property-map__sheet"
      role="dialog"
      aria-modal="true"
      aria-label={pin.title}
    >
      <button
        type="button"
        className="google-property-map__sheet-close"
        aria-label={t.leadCapturePopup.closeAria}
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
      <div className="google-property-map__info google-property-map__info--xl">
        <PropertyMapPinCard
          pin={pin}
          content={content}
          neighborhoodLabel={neighborhoodLabel}
          listingLabel={listingLabel}
          classPrefix="google-property-map__info"
        />
      </div>
    </div>
  )
}

function GooglePropertyMapShell(props: PropertyMapProps) {
  const { content, expanded } = props
  const viewport = useViewport()
  const isMobile = viewport === 'mobile'

  return (
    <PropertyMapShell {...props}>
      {(ctx) => {
        const activePin = ctx.pins.find((pin) => pin.id === ctx.activePinId) ?? null

        return (
          <div className="google-property-map__stage">
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
              <MapPinsLayer
                {...ctx}
                content={content}
                showInfoWindow={!isMobile}
              />
            </Map>
            {isMobile && activePin ? (
              <MobileMapPinSheet
                pin={activePin}
                content={content}
                neighborhoodLabel={ctx.neighborhoodLabel}
                listingLabel={ctx.listingLabel}
                onClose={() => ctx.onPinSelect(null)}
              />
            ) : null}
          </div>
        )
      }}
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

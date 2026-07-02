import { getActiveMapProvider } from '../../services/mapService'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import PlaceholderPropertyMap from './PlaceholderPropertyMap'
import './PropertyMap.css'

interface PropertyMapProps {
  pins: PropertyMapPin[]
  content: MapSectionContent
}

export default function PropertyMap({ pins, content }: PropertyMapProps) {
  const provider = getActiveMapProvider()

  if (provider === 'placeholder') {
    return <PlaceholderPropertyMap pins={pins} content={content} />
  }

  /**
   * Live map providers — implement when credentials are configured:
   *   provider === 'google'  → GooglePropertyMap (VITE_GOOGLE_MAPS_API_KEY)
   *   provider === 'mapbox'  → MapboxPropertyMap (VITE_MAPBOX_ACCESS_TOKEN)
   */
  return <PlaceholderPropertyMap pins={pins} content={content} />
}

import { getActiveMapProvider } from '../../services/mapService'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import GooglePropertyMap from './GooglePropertyMap'
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

  if (provider === 'google') {
    return <GooglePropertyMap pins={pins} content={content} />
  }

  return <PlaceholderPropertyMap pins={pins} content={content} />
}

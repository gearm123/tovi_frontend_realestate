import type { ReactNode } from 'react'
import { getActiveMapProvider } from '../../services/mapService'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import GooglePropertyMap from './GooglePropertyMap'
import PlaceholderPropertyMap from './PlaceholderPropertyMap'
import './PropertyMap.css'

export interface PropertyMapProps {
  pins: PropertyMapPin[]
  content: MapSectionContent
  expandable?: boolean
  expanded?: boolean
  onExpand?: () => void
  onCollapse?: () => void
  filterControls?: ReactNode
  variant?: 'section' | 'page'
  expandTrigger?: 'button' | 'search'
}

export default function PropertyMap({
  pins,
  content,
  expandable,
  expanded,
  onExpand,
  onCollapse,
  filterControls,
  variant,
  expandTrigger,
}: PropertyMapProps) {
  const provider = getActiveMapProvider()
  const shared = {
    pins,
    content,
    expandable,
    expanded,
    onExpand,
    onCollapse,
    filterControls,
    variant,
    expandTrigger,
  }

  if (provider === 'google') {
    return <GooglePropertyMap {...shared} />
  }

  return <PlaceholderPropertyMap {...shared} />
}

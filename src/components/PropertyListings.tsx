import { useViewport } from '../hooks/useViewport'
import DesktopListings from './property-listings/desktop/DesktopListings'
import MobileListings from './property-listings/mobile/MobileListings'

export default function PropertyListings() {
  const viewport = useViewport()

  if (viewport === 'mobile') {
    return <MobileListings />
  }

  return <DesktopListings />
}

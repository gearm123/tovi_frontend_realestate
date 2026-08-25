import type { Property } from '../types/property'
import { useViewport } from '../hooks/useViewport'
import DesktopListings from './property-listings/desktop/DesktopListings'
import MobileListings from './property-listings/mobile/MobileListings'

interface PropertyListingsProps {
  properties: Property[]
  sectionLabel?: string
  title?: string
  intro?: string
  showHeader?: boolean
  collapseDescription?: boolean
  hideDescription?: boolean
}

export default function PropertyListings({
  properties,
  sectionLabel = "This week's selection",
  title = 'Properties for You',
  intro,
  showHeader = true,
  collapseDescription = false,
  hideDescription = false,
}: PropertyListingsProps) {
  const viewport = useViewport()

  if (viewport === 'mobile') {
    return (
      <MobileListings
        properties={properties}
        sectionLabel={sectionLabel}
        title={title}
        intro={intro}
        showHeader={showHeader}
        collapseDescription={collapseDescription}
        hideDescription={hideDescription}
      />
    )
  }

  return (
    <DesktopListings
      properties={properties}
      sectionLabel={sectionLabel}
      title={title}
      intro={intro}
      showHeader={showHeader}
      collapseDescription={collapseDescription}
      hideDescription={hideDescription}
    />
  )
}

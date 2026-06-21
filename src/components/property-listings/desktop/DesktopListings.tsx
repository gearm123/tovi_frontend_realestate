import { properties } from '../../../data/properties'
import ListingsHeader from '../shared/ListingsHeader'
import DesktopPropertyCard from './DesktopPropertyCard'
import './DesktopListings.css'

export default function DesktopListings() {
  return (
    <section id="listings" className="desktop-listings" aria-label="Property listings">
      <ListingsHeader />

      <div className="desktop-listings__stack">
        {properties.map((property, index) => (
          <DesktopPropertyCard
            key={property.id}
            property={property}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

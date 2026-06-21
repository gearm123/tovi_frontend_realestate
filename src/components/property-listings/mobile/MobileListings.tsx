import { properties } from '../../../data/properties'
import ListingsHeader from '../shared/ListingsHeader'
import MobilePropertyCard from './MobilePropertyCard'
import './MobileListings.css'

export default function MobileListings() {
  return (
    <section id="listings" className="mobile-listings" aria-label="Property listings">
      <ListingsHeader />

      <div className="mobile-listings__stack">
        {properties.map((property, index) => (
          <MobilePropertyCard
            key={property.id}
            property={property}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

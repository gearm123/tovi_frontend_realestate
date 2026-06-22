import HeroVideo from '../components/HeroVideo'
import PropertyListings from '../components/PropertyListings'
import { properties } from '../data/properties'

export default function HomePage() {
  const featured = properties.filter((p) => p.featured)

  return (
    <>
      <HeroVideo />
      <PropertyListings
        properties={featured}
        sectionLabel="This week's selection"
        title="Properties for You"
        intro="Handpicked apartments and homes across Tel Aviv — each one chosen for its light, its neighborhood, and the life you might build there."
      />
    </>
  )
}

import HeroVideo from '../components/HeroVideo'
import PropertyListings from '../components/PropertyListings'
import PropertySearchSection from '../components/PropertySearchSection'
import ServicesOverview from '../components/services/ServicesOverview'
import AboutSection from '../components/trust/AboutSection'
import ReviewsSection from '../components/trust/ReviewsSection'
import { useLanguage } from '../context/LanguageContext'
import { getFeaturedProperties } from '../services/propertyService'

export default function HomePage() {
  const { t } = useLanguage()
  const featured = getFeaturedProperties()

  return (
    <>
      <HeroVideo />
      <PropertyListings
        properties={featured}
        sectionLabel={t.home.sectionLabel}
        title={t.home.title}
        intro={t.home.intro}
      />
      <AboutSection />
      <ServicesOverview />
      <ReviewsSection />
      <PropertySearchSection id="search" showListingsHeader listingsTitle={t.search.resultsTitle} />
    </>
  )
}

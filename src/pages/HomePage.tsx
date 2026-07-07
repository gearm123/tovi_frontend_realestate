import HeroVideo from '../components/HeroVideo'
import PageSeo from '../components/seo/PageSeo'
import PropertyListings from '../components/PropertyListings'
import PropertyMapSection from '../components/map/PropertyMapSection'
import PropertySearchSection from '../components/PropertySearchSection'
import ConversionSections from '../components/conversion/ConversionSections'
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
      <PageSeo pageKey="home" />
      <HeroVideo />
      <PropertyListings
        properties={featured}
        sectionLabel={t.home.sectionLabel}
        title={t.home.title}
        intro={t.home.intro}
      />
      <AboutSection />
      <ServicesOverview />
      <PropertyMapSection />
      <PropertySearchSection id="search" showListingsHeader listingsTitle={t.search.resultsTitle} />
      <ReviewsSection />
      <ConversionSections variant="split" />
    </>
  )
}

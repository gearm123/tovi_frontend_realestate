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
import { useSiteData } from '../hooks/useSiteData'

const HOME_FEATURED_COUNT = 6

export default function HomePage() {
  const { t } = useLanguage()
  const { properties } = useSiteData()
  const featured = properties.filter((property) => property.featured).slice(0, HOME_FEATURED_COUNT)

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
      <ServicesOverview />
      <PropertyMapSection />
      <PropertySearchSection id="search" showListingsHeader listingsTitle={t.search.resultsTitle} />
      <AboutSection />
      <ReviewsSection />
      <ConversionSections variant="split" />
    </>
  )
}

import HeroVideo from '../components/HeroVideo'
import PageSeo from '../components/seo/PageSeo'
import PropertyMapSection from '../components/map/PropertyMapSection'
import PropertySearchSection from '../components/PropertySearchSection'
import AboutSection from '../components/trust/AboutSection'
import ReviewsSection from '../components/trust/ReviewsSection'

export default function HomePage() {
  return (
    <>
      <PageSeo pageKey="home" />
      <HeroVideo compact />
      <PropertySearchSection
        id="home-search"
        variant="simple"
        prominence="hero"
      />
      <PropertyMapSection />
      <AboutSection compact />
      <ReviewsSection compact maxItems={3} maxQuoteLength={140} />
    </>
  )
}

import HeroVideo from '../components/HeroVideo'
import HomeHighlightListings from '../components/HomeHighlightListings'
import PageSeo from '../components/seo/PageSeo'
import PropertySearchSection from '../components/PropertySearchSection'
import AboutSection from '../components/trust/AboutSection'

export default function HomePage() {
  return (
    <>
      <PageSeo pageKey="home" />
      <HeroVideo compact />
      <HomeHighlightListings />
      <PropertySearchSection
        id="home-search"
        variant="simple"
        prominence="hero"
        embedMap
      />
      <AboutSection compact />
    </>
  )
}

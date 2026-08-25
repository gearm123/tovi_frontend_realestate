import HeroVideo from '../components/HeroVideo'
import PageSeo from '../components/seo/PageSeo'
import PropertyMapSection from '../components/map/PropertyMapSection'
import PropertySearchSection from '../components/PropertySearchSection'
import ConversionSections from '../components/conversion/ConversionSections'
import AboutSection from '../components/trust/AboutSection'
import ReviewsSection from '../components/trust/ReviewsSection'
import { useLanguage } from '../context/LanguageContext'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <>
      <PageSeo pageKey="home" />
      <HeroVideo compact />
      <PropertySearchSection
        id="home-search"
        variant="simple"
        prominence="hero"
        showListingsHeader
        listingsTitle={t.home.title}
        hideDescription
      />
      <PropertyMapSection />
      <AboutSection compact />
      <ReviewsSection compact maxItems={3} maxQuoteLength={140} />
      <ConversionSections variant="split" />
    </>
  )
}

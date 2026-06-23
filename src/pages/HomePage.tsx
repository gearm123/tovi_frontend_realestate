import HeroVideo from '../components/HeroVideo'
import PropertyListings from '../components/PropertyListings'
import { useLanguage } from '../context/LanguageContext'
import { properties } from '../data/properties'

export default function HomePage() {
  const { t } = useLanguage()
  const featured = properties.filter((p) => p.featured)

  return (
    <>
      <HeroVideo />
      <PropertyListings
        properties={featured}
        sectionLabel={t.home.sectionLabel}
        title={t.home.title}
        intro={t.home.intro}
      />
    </>
  )
}

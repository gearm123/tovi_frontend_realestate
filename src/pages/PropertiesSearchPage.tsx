import PageShell from '../components/PageShell'
import PropertyMapSection from '../components/map/PropertyMapSection'
import PropertySearchSection from '../components/PropertySearchSection'
import { useLanguage } from '../context/LanguageContext'

export default function PropertiesSearchPage() {
  const { t } = useLanguage()

  return (
    <>
      <PageShell
        title={t.search.title}
        accent={t.search.accent}
        subtitle={t.search.subtitle}
      />
      <PropertyMapSection />
      <PropertySearchSection showListingsHeader={false} />
    </>
  )
}

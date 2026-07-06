import PageShell from '../components/PageShell'
import PropertySearchSection from '../components/PropertySearchSection'
import { useLanguage } from '../context/LanguageContext'

export default function AllRentalsPage() {
  const { t } = useLanguage()

  return (
    <>
      <PageShell
        title={t.rentals.title}
        accent={t.rentals.accent}
        subtitle={t.rentals.subtitle}
        seoKey="rentals"
      />
      <PropertySearchSection
        initialStatus="rental"
        listingsTitle={t.rentals.listingsTitle}
        id="rentals-search"
      />
    </>
  )
}

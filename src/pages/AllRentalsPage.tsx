import PageShell from '../components/PageShell'
import PropertySearchSection from '../components/PropertySearchSection'
import { useLanguage } from '../context/LanguageContext'

export default function AllRentalsPage() {
  const { t } = useLanguage()

  return (
    <>
      <PageShell title={t.rentals.title} seoKey="rentals" />
      <PropertySearchSection initialStatus="rental" id="rentals-search" />
    </>
  )
}

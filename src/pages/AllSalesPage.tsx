import PageShell from '../components/PageShell'
import PropertySearchSection from '../components/PropertySearchSection'
import { useLanguage } from '../context/LanguageContext'

export default function AllSalesPage() {
  const { t } = useLanguage()

  return (
    <>
      <PageShell title={t.sales.title} accent={t.sales.accent} subtitle={t.sales.subtitle} seoKey="sales" />
      <PropertySearchSection
        initialStatus="sale"
        listingsTitle={t.sales.listingsTitle}
        id="sales-search"
      />
    </>
  )
}

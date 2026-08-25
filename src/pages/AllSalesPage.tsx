import PageShell from '../components/PageShell'
import PropertySearchSection from '../components/PropertySearchSection'
import { useLanguage } from '../context/LanguageContext'

export default function AllSalesPage() {
  const { t } = useLanguage()

  return (
    <>
      <PageShell title={t.sales.title} seoKey="sales" />
      <PropertySearchSection initialStatus="sale" id="sales-search" />
    </>
  )
}

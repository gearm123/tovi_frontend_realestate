import { useMemo } from 'react'
import PropertyFiltersBar from '../components/PropertyFilters'
import PropertyListings from '../components/PropertyListings'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import { properties } from '../data/properties'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { defaultFilters } from '../types/filters'

const SALE_PRICE_MAX = 10000000

export default function AllSalesPage() {
  const { t, format } = useLanguage()
  const sales = useMemo(
    () => properties.filter((p) => p.listingType === 'sale'),
    [],
  )
  const { filters, setFilters, filtered } = usePropertyFilters(sales)

  const activeFilters = {
    ...filters,
    priceMax: Math.min(filters.priceMax, SALE_PRICE_MAX),
  }

  return (
    <>
      <PageShell title={t.sales.title} subtitle={t.sales.subtitle}>
        <PropertyFiltersBar
          filters={activeFilters}
          onChange={setFilters}
          onReset={() =>
            setFilters({ ...defaultFilters, priceMax: SALE_PRICE_MAX })
          }
          priceMax={SALE_PRICE_MAX}
        />
      </PageShell>
      <PropertyListings
        properties={filtered}
        sectionLabel={format(t.sales.countLabel, { count: filtered.length })}
        title={t.sales.listingsTitle}
        showHeader={false}
      />
    </>
  )
}

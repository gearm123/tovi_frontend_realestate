import { useMemo } from 'react'
import PropertyFiltersBar from '../components/PropertyFilters'
import PropertyListings from '../components/PropertyListings'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import { properties } from '../data/properties'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { defaultFilters } from '../types/filters'

const RENTAL_PRICE_MAX = 25000

export default function AllRentalsPage() {
  const { t, format } = useLanguage()
  const rentals = useMemo(
    () => properties.filter((p) => p.listingType === 'rental'),
    [],
  )
  const { filters, setFilters, filtered } = usePropertyFilters(rentals)

  const activeFilters = {
    ...filters,
    priceMax: Math.min(filters.priceMax, RENTAL_PRICE_MAX),
  }

  return (
    <>
      <PageShell title={t.rentals.title} accent={t.rentals.accent} subtitle={t.rentals.subtitle}>
        <PropertyFiltersBar
          filters={activeFilters}
          onChange={setFilters}
          onReset={() =>
            setFilters({ ...defaultFilters, priceMax: RENTAL_PRICE_MAX })
          }
          priceMax={RENTAL_PRICE_MAX}
          isRental
        />
      </PageShell>
      <PropertyListings
        properties={filtered}
        sectionLabel={format(t.rentals.countLabel, { count: filtered.length })}
        title={t.rentals.listingsTitle}
        showHeader={false}
      />
    </>
  )
}

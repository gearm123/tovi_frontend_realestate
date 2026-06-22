import { useMemo } from 'react'
import PropertyFiltersBar from '../components/PropertyFilters'
import PropertyListings from '../components/PropertyListings'
import PageShell from '../components/PageShell'
import { properties } from '../data/properties'
import { usePropertyFilters } from '../hooks/usePropertyFilters'
import { defaultFilters } from '../types/filters'

const RENTAL_PRICE_MAX = 25000

export default function AllRentalsPage() {
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
      <PageShell
        title="All Rentals"
        subtitle="Discover apartments and homes available for rent in Tel Aviv."
      >
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
        sectionLabel={`${filtered.length} properties`}
        title="Properties for Rent"
        showHeader={false}
      />
    </>
  )
}

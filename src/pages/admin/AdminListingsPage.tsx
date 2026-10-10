import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { refreshListings, removeCachedListing, upsertCachedListing } from '../../lib/siteDataStore'
import { deleteListing, saveListing } from '../../services/listingsApi'
import {
  closedListingAvailability,
  isListingAvailable,
  listingAvailability,
} from '../../utils/listingAvailability'
import { propertyCodeMatches } from '../../utils/propertyCode'
import './adminShared.css'

export default function AdminListingsPage() {
  const { properties, listingsStatus, listingsError } = useSiteData()
  const [actionError, setActionError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [query, setQuery] = useState('')
  const visibleListings = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return properties
    return properties.filter((property) => {
      if (/\d/.test(needle) && propertyCodeMatches(property.propertyCode, query)) return true
      return (
        property.title.toLowerCase().includes(needle) ||
        property.address.toLowerCase().includes(needle) ||
        property.neighborhood.toLowerCase().includes(needle)
      )
    })
  }, [properties, query])

  const handleDelete = async (id: string, title: string) => {
    const ok = window.confirm(`Delete listing “${title || id}”? This removes it for every visitor.`)
    if (!ok) return
    setActionError('')
    try {
      await deleteListing(id)
      removeCachedListing(id)
      await refreshListings()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not delete that listing.')
    }
  }

  const toggleAvailability = async (id: string) => {
    const property = properties.find((item) => item.id === id)
    if (!property || updatingId) return
    const next = isListingAvailable(property)
      ? closedListingAvailability(property.listingType)
      : 'available'
    const label = next === 'sold' ? 'sold' : next === 'rented' ? 'rented' : 'available'
    const effect =
      next === 'available'
        ? 'It will appear on the website again.'
        : 'It will be removed from the website until you mark it available again.'
    const ok = window.confirm(`Mark “${property.title || id}” as ${label}? ${effect}`)
    if (!ok) return
    setActionError('')
    setUpdatingId(id)
    try {
      const saved = await saveListing({ ...property, availability: next })
      upsertCachedListing(saved)
      await refreshListings()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not update that listing.')
    } finally {
      setUpdatingId('')
    }
  }

  const toggleFeatured = async (id: string) => {
    const property = properties.find((item) => item.id === id)
    if (!property) return
    setActionError('')
    try {
      const saved = await saveListing({ ...property, featured: !property.featured })
      upsertCachedListing(saved)
      await refreshListings()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not update that listing.')
    }
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Listings</h1>
          <p className="admin-page__subtitle">
            Mark a sale as sold or a rental as rented to remove it from the website. Mark it
            available again when it should return.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn" to="/admin/listings/new">
            Add listing
          </Link>
        </div>
      </header>

      {listingsStatus === 'error' ? (
        <div className="admin-notice admin-notice--warn">{listingsError}</div>
      ) : null}
      {actionError ? <div className="admin-notice admin-notice--warn">{actionError}</div> : null}

      <section className="admin-card">
        {listingsStatus === 'loading' ? (
          <p className="admin-empty">Loading listings…</p>
        ) : properties.length === 0 ? (
          <p className="admin-empty">No listings yet. Add your first property.</p>
        ) : (
          <>
          <div className="admin-field" style={{ maxWidth: 360, marginBottom: '0.9rem' }}>
            <label htmlFor="listing-search">Property ID or title</label>
            <input
              id="listing-search"
              value={query}
              placeholder="PT-1001"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {visibleListings.length === 0 ? (
            <p className="admin-empty">No listings match that search.</p>
          ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Property ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Neighborhood</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleListings.map((property) => {
                  const availability = listingAvailability(property)
                  return (
                  <tr key={property.id}>
                    <td>
                      <img
                        className="admin-table__thumb"
                        src={property.image}
                        alt=""
                      />
                    </td>
                    <td>
                      <strong>{property.propertyCode}</strong>
                    </td>
                    <td>
                      <strong>{property.title || '(Untitled)'}</strong>
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge--${property.listingType}`}>
                        {property.listingType === 'rental' ? 'Rent' : 'Buy'}
                      </span>
                    </td>
                    <td>{property.neighborhood}</td>
                    <td>{property.price}</td>
                    <td>
                      <div className="admin-table__actions" style={{ gap: 4 }}>
                        <span className={`admin-badge admin-badge--${availability}`}>
                          {availability === 'sold'
                            ? 'Sold'
                            : availability === 'rented'
                              ? 'Rented'
                              : 'Available'}
                        </span>
                        {property.featured ? (
                          <span className="admin-badge admin-badge--featured">Featured</span>
                        ) : null}
                        {property.exclusive ? (
                          <span className="admin-badge">Exclusive</span>
                        ) : null}
                        {property.isNew ? <span className="admin-badge">New</span> : null}
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <Link
                          className="admin-btn admin-btn--secondary admin-btn--small"
                          to={`/admin/listings/${property.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="admin-btn admin-btn--secondary admin-btn--small"
                          onClick={() => toggleAvailability(property.id)}
                          disabled={updatingId === property.id}
                        >
                          {updatingId === property.id
                            ? 'Saving…'
                            : isListingAvailable(property)
                              ? property.listingType === 'rental'
                                ? 'Mark rented'
                                : 'Mark sold'
                              : 'Mark available'}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--secondary admin-btn--small"
                          onClick={() => toggleFeatured(property.id)}
                        >
                          {property.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <a
                          className="admin-btn admin-btn--secondary admin-btn--small"
                          href={`/property/${property.listingType}/${property.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => handleDelete(property.id, property.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          )}
          </>
        )}
      </section>
    </div>
  )
}

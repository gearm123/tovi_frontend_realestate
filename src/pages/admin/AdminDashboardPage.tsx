import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import './adminShared.css'

export default function AdminDashboardPage() {
  const data = useSiteData()
  const sales = data.properties.filter((p) => p.listingType === 'sale').length
  const rentals = data.properties.filter((p) => p.listingType === 'rental').length
  const featured = data.properties.filter((p) => p.featured).length

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__subtitle">
            Listings, agents, business details, and the lead popup are saved for every visitor.
          </p>
        </div>
      </header>

      {data.listingsStatus === 'error' ? (
        <div className="admin-notice admin-notice--warn">{data.listingsError}</div>
      ) : null}
      {data.contentStatus === 'error' ? (
        <div className="admin-notice admin-notice--warn">{data.contentError}</div>
      ) : null}

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat__value">{data.properties.length}</span>
          <span className="admin-stat__label">Listings</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__value">{sales}</span>
          <span className="admin-stat__label">For sale</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__value">{rentals}</span>
          <span className="admin-stat__label">Rentals</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__value">{data.agents.length}</span>
          <span className="admin-stat__label">Agents</span>
        </div>
      </div>

      <section className="admin-card">
        <h2 className="admin-page__title" style={{ fontSize: '1.05rem' }}>
          Quick actions
        </h2>
        <div className="admin-page__actions" style={{ marginTop: '0.85rem' }}>
          <Link className="admin-btn" to="/admin/listings/new">
            Add listing
          </Link>
          <Link className="admin-btn admin-btn--secondary" to="/admin/listings">
            Manage listings
          </Link>
          <Link className="admin-btn admin-btn--secondary" to="/admin/agents">
            Manage agents
          </Link>
          <Link className="admin-btn admin-btn--secondary" to="/admin/business">
            Business settings
          </Link>
        </div>
        <p className="admin-page__subtitle" style={{ marginTop: '1rem' }}>
          Featured listings on homepage: {featured}
        </p>
      </section>
    </div>
  )
}

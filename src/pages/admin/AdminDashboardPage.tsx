import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { resetSiteData } from '../../lib/siteDataStore'
import './adminShared.css'

export default function AdminDashboardPage() {
  const data = useSiteData()
  const sales = data.properties.filter((p) => p.listingType === 'sale').length
  const rentals = data.properties.filter((p) => p.listingType === 'rental').length
  const featured = data.properties.filter((p) => p.featured).length

  const handleReset = () => {
    const ok = window.confirm(
      'Reset all admin data to the original demo content? This cannot be undone.',
    )
    if (!ok) return
    resetSiteData()
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard</h1>
          <p className="admin-page__subtitle">
            Manage listings, agents, and business settings. Changes save in this browser and update
            the live site immediately.
          </p>
        </div>
      </header>

      <div className="admin-notice admin-notice--warn">
        Data is stored in this browser (localStorage). For multi-device production use, connect a
        backend/CRM later. Leads from contact forms still arrive in Netlify Forms.
      </div>

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
        <div style={{ marginTop: '1rem' }}>
          <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={handleReset}>
            Reset to demo data
          </button>
        </div>
      </section>
    </div>
  )
}

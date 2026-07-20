import { Link, Navigate, useNavigate } from 'react-router-dom'
import { clearAdminSession, isAdminAuthenticated } from '../lib/adminAuth'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
  const navigate = useNavigate()

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleLogout = () => {
    clearAdminSession()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">ProperTLV Admin</h1>
        <div className="admin-dashboard__actions">
          <Link to="/" className="admin-dashboard__link">
            View site
          </Link>
          <button type="button" className="admin-dashboard__logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>
      <main className="admin-dashboard__main">
        <p className="admin-dashboard__welcome">You are signed in as Tova.</p>
        <p className="admin-dashboard__hint">
          Listing management tools will appear here as you add real property data.
        </p>
      </main>
    </div>
  )
}

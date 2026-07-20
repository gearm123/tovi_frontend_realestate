import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAdminSession } from '../lib/adminAuth'
import './AdminShell.css'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/listings', label: 'Listings' },
  { to: '/admin/agents', label: 'Agents' },
  { to: '/admin/business', label: 'Business' },
  { to: '/admin/lead-capture', label: 'Lead popup' },
]

export default function AdminShell() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAdminSession()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__brand">ProperTLV</div>
        <p className="admin-shell__brand-sub">Admin</p>
        <nav className="admin-shell__nav" aria-label="Admin">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-shell__nav-link${isActive ? ' admin-shell__nav-link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-shell__sidebar-footer">
          <a className="admin-shell__footer-link" href="/" target="_blank" rel="noreferrer">
            View site
          </a>
          <button type="button" className="admin-shell__logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>
      <div className="admin-shell__main">
        <Outlet />
      </div>
    </div>
  )
}

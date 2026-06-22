import { Link } from 'react-router-dom'
import './Header.css'

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/sales', label: 'All Sales' },
  { to: '/rentals', label: 'All Rentals' },
  { to: '/sellers-package', label: 'Sellers Exclusive Package' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/magazine', label: 'PROPERTLV Magazine' },
]

export default function Header() {
  return (
    <header className="header">
      <div className="header__masthead">
        <Link to="/" className="header__brand">
          <h1 className="header__title">PROPERTLV</h1>
          <p className="header__tagline">Tel Aviv Real Estate</p>
        </Link>
      </div>

      <nav className="header__nav" aria-label="Main navigation">
        {navItems.map((item, index) => (
          <span key={item.to} className="header__nav-item">
            {index > 0 && (
              <span className="header__nav-dot" aria-hidden="true" />
            )}
            <Link to={item.to}>{item.label}</Link>
          </span>
        ))}
      </nav>
    </header>
  )
}

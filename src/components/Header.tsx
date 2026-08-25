import { Link, NavLink, useLocation } from 'react-router-dom'
import { isNavItemActive, siteNavItems } from '../data/siteNav'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../hooks/useSiteContent'
import { scrollPageToTop } from '../utils/scrollPageToTop'
import BrandTitle from './BrandTitle'
import './Header.css'

export default function Header() {
  const { t } = useLanguage()
  const { business } = useSiteContent()
  const { pathname } = useLocation()

  return (
    <header className="header">
      <Link
        to="/"
        className="header__logo-link"
        aria-label={`${business.name} home`}
        onClick={scrollPageToTop}
      >
        <img
          className="header__logo"
          src="/assets/logo_shine_content.png"
          alt={`${business.name} logo`}
        />
      </Link>

      <div className="header__masthead">
        <Link to="/" className="header__brand" onClick={scrollPageToTop}>
          <BrandTitle as="h1" className="header__title" />
          <p className="header__tagline orange-cursive-title orange-cursive-title--tagline">
            {t.header.tagline}
          </p>
        </Link>
      </div>

      <nav className="header__nav" aria-label={t.header.navAria}>
        {siteNavItems.map((item, index) => (
          <span key={item.to} className="header__nav-item">
            {index > 0 && <span className="header__nav-dot" aria-hidden="true" />}
            <NavLink
              to={item.to}
              className={() => (isNavItemActive(item, pathname) ? 'active' : undefined)}
              onClick={scrollPageToTop}
            >
              {t.header.nav[item.key]}
            </NavLink>
          </span>
        ))}
      </nav>
    </header>
  )
}

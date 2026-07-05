import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../hooks/useSiteContent'
import BrandTitle from './BrandTitle'
import LanguageToggle from './LanguageToggle'
import './Header.css'

const navKeys = [
  { to: '/about', key: 'about' as const },
  { to: '/services', key: 'services' as const },
  { to: '/properties', key: 'search' as const },
  { to: '/sales', key: 'sales' as const },
  { to: '/rentals', key: 'rentals' as const },
  { to: '/sellers-package', key: 'sellersPackage' as const },
  { to: '/contact', key: 'contact' as const },
  { to: '/magazine', key: 'magazine' as const },
]

export default function Header() {
  const { t } = useLanguage()
  const { business } = useSiteContent()

  return (
    <header className="header">
      <Link to="/" className="header__logo-link" aria-label={`${business.name} home`}>
        <img
          className="header__logo"
          src="/assets/logo_shine_content.png"
          alt={`${business.name} logo`}
        />
      </Link>

      <LanguageToggle />

      <div className="header__masthead">
        <Link to="/" className="header__brand">
          <BrandTitle as="h1" className="header__title" />
          <p className="header__tagline orange-cursive-title orange-cursive-title--tagline">
            {t.header.tagline}
          </p>
        </Link>
      </div>

      <nav className="header__nav" aria-label={t.header.navAria}>
        {navKeys.map((item, index) => (
          <span key={item.to} className="header__nav-item">
            {index > 0 && (
              <span className="header__nav-dot" aria-hidden="true" />
            )}
            <Link to={item.to}>{t.header.nav[item.key]}</Link>
          </span>
        ))}
      </nav>
    </header>
  )
}

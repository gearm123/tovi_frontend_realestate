import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './FloatingHomeButton.css'

function HomeIcon() {
  return (
    <svg
      className="floating-home-button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 3.2 3 10.5v9.3a1.2 1.2 0 0 0 1.2 1.2h5.1v-5.7h5.4v5.7h5.1a1.2 1.2 0 0 0 1.2-1.2v-9.3L12 3.2Zm0 2.3 6.3 5.1v7.4h-2.7v-5.7H8.4v5.7H5.7v-7.4L12 5.5Z"
      />
    </svg>
  )
}

export default function FloatingHomeButton() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  if (pathname === '/') return null

  return (
    <Link
      to="/"
      className="floating-home-button"
      aria-label={t.floatingHome.ariaLabel}
      title={t.floatingHome.ariaLabel}
    >
      <HomeIcon />
      <span className="floating-home-button__label">{t.floatingHome.label}</span>
    </Link>
  )
}

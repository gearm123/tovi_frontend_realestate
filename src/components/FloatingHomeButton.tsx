import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { scrollPageToTop } from '../utils/scrollPageToTop'
import './FloatingHomeButton.css'

function HomeIcon() {
  return (
    <svg className="floating-home__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 3.2 3.5 10.2V20a1 1 0 0 0 1 1H9v-6h6v6h4.5a1 1 0 0 0 1-1v-9.8L12 3.2Z"
      />
    </svg>
  )
}

export default function FloatingHomeButton() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  return (
    <Link
      to="/"
      className="floating-home"
      aria-label={t.floatingHome.ariaLabel}
      title={t.floatingHome.ariaLabel}
      onClick={(event) => {
        if (pathname === '/') {
          event.preventDefault()
          scrollPageToTop()
        }
      }}
    >
      <HomeIcon />
    </Link>
  )
}

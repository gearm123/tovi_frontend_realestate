import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { CONTACT_PLACEHOLDERS } from '../data/placeholders'
import { useSiteContent } from '../hooks/useSiteContent'
import BrandTitle from './BrandTitle'
import SocialLinks from './SocialLinks'
import ReviewsSection from './trust/ReviewsSection'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const { business } = useSiteContent()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <footer className={`footer${isHome ? ' footer--with-reviews' : ''}`}>
      <div className="footer__inner">
        <BrandTitle as="p" className="footer__logo" />

        <nav className="footer__links" aria-label={t.footer.navAria}>
          <Link to="/sales">{t.header.nav.buy}</Link>
          <Link to="/rentals">{t.header.nav.rent}</Link>
          <Link to="/about">{t.footer.about}</Link>
          <Link to="/contact">{t.footer.contactUs}</Link>
        </nav>

        <div className="footer__meta">
          <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>
          {CONTACT_PLACEHOLDERS.email ? (
            <span>{business.email}</span>
          ) : (
            <a href={`mailto:${business.email}`}>{business.email}</a>
          )}
          <SocialLinks
            social={business.social}
            instagramLabel={t.footer.instagram}
            facebookLabel={t.footer.facebook}
            linkedinLabel={t.footer.linkedin}
            linksDisabled={false}
          />
        </div>
      </div>

      {isHome ? (
        <div className="footer__reviews">
          <ReviewsSection
            id="footer-reviews"
            compact
            maxItems={3}
            maxQuoteLength={140}
          />
        </div>
      ) : null}

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} <BrandTitle as="span" className="footer__copyright-brand" />.{' '}
        {t.footer.rights}
      </p>
    </footer>
  )
}

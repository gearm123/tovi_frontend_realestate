import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { CONTACT_PLACEHOLDERS } from '../data/placeholders'
import { useSiteContent } from '../hooks/useSiteContent'
import SocialLinks from './SocialLinks'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const { business } = useSiteContent()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__block footer__block--brand">
          <p className="footer__logo">{business.name}</p>
          <p>{t.footer.blurb}</p>
          <nav className="footer__links" aria-label={t.footer.navAria}>
            <Link to="/about">{t.footer.about}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/sales">{t.footer.sales}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/rentals">{t.footer.rentals}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/magazine">{t.footer.magazine}</Link>
          </nav>
        </section>

        <section className="footer__block footer__block--contact">
          <h3 className="footer__heading">{t.footer.getInTouch}</h3>
          <ul className="footer__contact-list">
            <li>
              <span className="footer__contact-label">{t.footer.phone}</span>
              <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>
            </li>
            <li>
              <span className="footer__contact-label">{t.footer.email}</span>
              <span className="footer__contact-value">
                {CONTACT_PLACEHOLDERS.email ? (
                  <span>{business.email}</span>
                ) : (
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                )}
                {CONTACT_PLACEHOLDERS.email && (
                  <span className="footer__placeholder-tag">{t.footer.placeholder}</span>
                )}
              </span>
            </li>
            <li>
              <span className="footer__contact-label">{t.footer.address}</span>
              <span className="footer__contact-value">
                <span>{business.address.display}</span>
                {CONTACT_PLACEHOLDERS.address && (
                  <span className="footer__placeholder-tag">{t.footer.placeholder}</span>
                )}
              </span>
            </li>
          </ul>

          <div className="footer__social-wrap">
            <span className="footer__contact-label">{t.footer.followUs}</span>
            {CONTACT_PLACEHOLDERS.social && (
              <span className="footer__placeholder-tag footer__placeholder-tag--inline">
                {t.footer.placeholder}
              </span>
            )}
            <SocialLinks
              social={business.social}
              instagramLabel={t.footer.instagram}
              facebookLabel={t.footer.facebook}
              linksDisabled={CONTACT_PLACEHOLDERS.social}
            />
          </div>

          <p>
            <Link to="/contact" className="footer__cta">
              {t.footer.contactUs}
            </Link>
          </p>
        </section>
      </div>

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} {business.name}. {t.footer.rights}
      </p>
    </footer>
  )
}

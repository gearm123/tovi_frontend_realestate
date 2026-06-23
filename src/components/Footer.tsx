import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__block">
          <h3 className="footer__heading">PROPERTLV</h3>
          <p>{t.footer.blurb}</p>
          <p className="footer__links">
            <Link to="/about">{t.footer.about}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/sales">{t.footer.sales}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/rentals">{t.footer.rentals}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/magazine">{t.footer.magazine}</Link>
          </p>
        </section>

        <section className="footer__block">
          <h3 className="footer__heading">{t.footer.getInTouch}</h3>
          <p>
            <a href="mailto:hello@propertlv.com">hello@propertlv.com</a>
          </p>
          <p>
            <a href="tel:+97235551234">+972 3 555 1234</a>
          </p>
          <p className="footer__address">{t.footer.address}</p>
          <p>
            <Link to="/contact" className="footer__cta">
              {t.footer.contactUs}
            </Link>
          </p>
        </section>
      </div>

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} PROPERTLV. {t.footer.rights}
      </p>
    </footer>
  )
}

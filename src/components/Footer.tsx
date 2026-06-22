import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__block">
          <h3 className="footer__heading">PROPERTLV</h3>
          <p>
            Curated homes and apartments across Tel Aviv — from Bauhaus gems on
            Rothschild to quiet family streets in Ramat Aviv.
          </p>
          <p className="footer__links">
            <Link to="/about">About</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/sales">All Sales</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/rentals">All Rentals</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/magazine">Magazine</Link>
          </p>
        </section>

        <section className="footer__block">
          <h3 className="footer__heading">Get in Touch</h3>
          <p>
            <a href="mailto:hello@propertlv.com">hello@propertlv.com</a>
          </p>
          <p>
            <a href="tel:+97235551234">+972 3 555 1234</a>
          </p>
          <p className="footer__address">Rothschild Blvd 45, Tel Aviv</p>
          <p>
            <Link to="/contact" className="footer__cta">
              Contact Us
            </Link>
          </p>
        </section>
      </div>

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} PROPERTLV. All rights reserved.
      </p>
    </footer>
  )
}

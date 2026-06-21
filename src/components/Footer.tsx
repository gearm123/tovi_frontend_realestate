import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <section id="about" className="footer__block">
          <h3 className="footer__heading">About PropertyTLV</h3>
          <p>
            We believe finding a home should feel personal — not transactional.
            PropertyTLV connects people with thoughtfully selected properties
            across Tel Aviv, from Bauhaus gems on Rothschild to quiet family
            streets in Ramat Aviv.
          </p>
        </section>

        <section id="contact" className="footer__block">
          <h3 className="footer__heading">Get in Touch</h3>
          <p>
            <a href="mailto:hello@propertytlv.com">hello@propertytlv.com</a>
          </p>
          <p>
            <a href="tel:+97235551234">+972 3 555 1234</a>
          </p>
          <p className="footer__address">Rothschild Blvd 45, Tel Aviv</p>
        </section>
      </div>

      <p className="footer__copyright">
        &copy; {new Date().getFullYear()} PropertyTLV. All rights reserved.
      </p>
    </footer>
  )
}

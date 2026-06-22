import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import './SellersPackagePage.css'

export default function SellersPackagePage() {
  return (
    <PageShell
      title="Sellers Exclusive Package"
      subtitle="A premium, end-to-end service for homeowners who expect more."
    >
      <div className="sellers-package">
        <p>
          The PROPERTLV Sellers Exclusive Package is designed for property owners
          who want a discreet, high-touch sale experience. From professional
          staging and photography to targeted marketing and qualified buyer
          screening, we handle every detail.
        </p>

        <ul className="sellers-package__list">
          <li>Professional photography and video tour</li>
          <li>Curated listing across premium channels</li>
          <li>Dedicated agent and weekly progress reports</li>
          <li>Negotiation support and legal coordination</li>
          <li>Exclusive buyer network access</li>
        </ul>

        <Link to="/contact" className="sellers-package__cta">
          Enquire about the package
        </Link>
      </div>
    </PageShell>
  )
}

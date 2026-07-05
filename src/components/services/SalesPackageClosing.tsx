import { Link } from 'react-router-dom'
import type { SalesPackageClosingContent } from '../../types/content'
import { useSiteContent } from '../../hooks/useSiteContent'
import './SalesPackageClosing.css'

interface SalesPackageClosingProps {
  section: SalesPackageClosingContent
}

export default function SalesPackageClosing({ section }: SalesPackageClosingProps) {
  const { business } = useSiteContent()

  return (
    <section className="sales-package-closing" aria-labelledby="sales-package-closing-title">
      <div className="sales-package-closing__inner">
        <h2 id="sales-package-closing-title" className="sales-package-closing__title">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="sales-package-closing__subtitle">{section.subtitle}</p>
        )}

        <div className="sales-package-closing__contacts">
          <a className="sales-package-closing__link" href={`tel:${business.phone.tel}`}>
            {business.phone.display}
          </a>
          <a className="sales-package-closing__link" href={`mailto:${business.email}`}>
            {business.email}
          </a>
          <a
            className="sales-package-closing__link"
            href="https://www.propertlv.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.propertlv.com
          </a>
        </div>

        <Link to="/contact?interest=selling" className="sales-package-closing__cta">
          {section.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import './ServicesOverview.css'

/** Homepage preview of services — links to full /services page */
export default function ServicesOverview() {
  const { content } = useSiteContent()
  const { servicesPage, exclusivityPackage, buyerServices, sellerServices } = content

  const cards = [
    {
      id: 'exclusivity',
      section: exclusivityPackage,
      href: '/services#exclusivity-package',
      variant: 'premium' as const,
    },
    {
      id: 'buyers',
      section: buyerServices,
      href: '/services#buyer-services',
      variant: 'default' as const,
    },
    {
      id: 'sellers',
      section: sellerServices,
      href: '/services#seller-services',
      variant: 'default' as const,
    },
  ]

  return (
    <section className="services-overview" aria-labelledby="services-overview-title">
      <header className="services-overview__header">
        <p className="services-overview__accent orange-cursive-title orange-cursive-title--subtitle">
          {servicesPage.accent}
        </p>
        <h2 id="services-overview-title" className="services-overview__title">
          {servicesPage.title}
        </h2>
        <p className="services-overview__intro">{servicesPage.overviewIntro}</p>
      </header>

      <div className="services-overview__grid">
        {cards.map(({ id, section, href, variant }) => (
          <article
            key={id}
            className={`services-overview__card services-overview__card--${variant}`}
          >
            {section.accent && (
              <p className="services-overview__card-accent">{section.accent}</p>
            )}
            <h3 className="services-overview__card-title">{section.title}</h3>
            <p className="services-overview__card-subtitle">{section.subtitle}</p>
            <Link to={href} className="services-overview__card-link">
              {section.ctaLabel}
            </Link>
          </article>
        ))}
      </div>

      <p className="services-overview__footer">
        <Link to="/services" className="services-overview__all-link">
          {servicesPage.viewAllLink}
        </Link>
      </p>
    </section>
  )
}

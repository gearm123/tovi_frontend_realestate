import { Link } from 'react-router-dom'
import type { ServiceSection } from '../../types/content'
import './ServiceSectionBlock.css'

interface ServiceSectionBlockProps {
  /** Content from src/data/content — PLACEHOLDER_COPY until client approves */
  section: ServiceSection
  id?: string
  /** premium = highlighted Exclusivity Package styling */
  variant?: 'default' | 'premium'
}

export default function ServiceSectionBlock({
  section,
  id,
  variant = 'default',
}: ServiceSectionBlockProps) {
  const ctaHref = section.ctaHref ?? '/contact'

  return (
    <article
      id={id}
      className={`service-block service-block--${variant}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      {section.heroImage && (
        <figure className="service-block__hero">
          <img
            className="service-block__hero-image"
            src={section.heroImage}
            alt={section.heroImageAlt ?? section.title}
            loading="eager"
            decoding="async"
          />
        </figure>
      )}

      <header className="service-block__header">
        <h2 className="service-block__title" id={id ? `${id}-title` : undefined}>
          {section.title}
        </h2>
        {section.packageDuration && (
          <p className="service-block__duration">{section.packageDuration}</p>
        )}
        {section.subtitle && <p className="service-block__subtitle">{section.subtitle}</p>}
      </header>

      {section.durationImage && (
        <figure className="service-block__duration-visual">
          <img
            className="service-block__duration-image"
            src={section.durationImage}
            alt={section.durationImageAlt ?? section.packageDuration ?? section.title}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}

      <div className="service-block__body">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}

        {section.highlights && section.highlights.length > 0 && (
          <div className="service-block__highlights">
            {section.highlightsTitle && (
              <h3 className="service-block__highlights-title">{section.highlightsTitle}</h3>
            )}
            <ul className="service-block__list">
              {section.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {section.groups?.map((group) => (
          <div key={group.title} className="service-block__group">
            {group.image && (
              <figure className="service-block__group-figure service-block__group-figure--single">
                <img
                  className="service-block__group-image"
                  src={group.image}
                  alt={group.imageAlt ?? group.title}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            )}
            <h3 className="service-block__group-title">{group.title}</h3>
            <ul className="service-block__list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        {section.bullets.length > 0 && (
          <ul className="service-block__list">
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <Link to={ctaHref} className="service-block__cta site-cta">
          {section.ctaLabel}
        </Link>

        {section.relatedLink && (
          <p className="service-block__related">
            <Link to={section.relatedLink.href}>{section.relatedLink.label}</Link>
          </p>
        )}

        {section.relatedLinks && section.relatedLinks.length > 0 && (
          <ul className="service-block__related-list">
            {section.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

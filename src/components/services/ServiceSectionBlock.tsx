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
        {section.accent && (
          <p className="service-block__accent orange-cursive-title orange-cursive-title--subtitle">
            {section.accent}
          </p>
        )}
        <h2 className="service-block__title" id={id ? `${id}-title` : undefined}>
          {section.title}
        </h2>
        {section.subtitle && <p className="service-block__subtitle">{section.subtitle}</p>}
      </header>

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
            {(group.image || group.secondaryImage) && (
              <div
                className={`service-block__group-media${
                  group.secondaryImage ? ' service-block__group-media--duo' : ''
                }`}
              >
                {group.image && (
                  <figure className="service-block__group-figure">
                    <img
                      className="service-block__group-image"
                      src={group.image}
                      alt={group.imageAlt ?? group.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                )}
                {group.secondaryImage && (
                  <figure className="service-block__group-figure service-block__group-figure--secondary">
                    <img
                      className="service-block__group-image"
                      src={group.secondaryImage}
                      alt={group.secondaryImageAlt ?? group.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                )}
              </div>
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

        <Link to={ctaHref} className="service-block__cta">
          {section.ctaLabel}
        </Link>
      </div>
    </article>
  )
}

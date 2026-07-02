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

        <ul className="service-block__list">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Link to={ctaHref} className="service-block__cta">
          {section.ctaLabel}
        </Link>
      </div>
    </article>
  )
}

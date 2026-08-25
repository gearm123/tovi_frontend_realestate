import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import './AboutSection.css'

interface AboutSectionProps {
  compact?: boolean
}

/** Homepage About Us — content from src/data/content (PLACEHOLDER_COPY) */
export default function AboutSection({ compact = false }: AboutSectionProps) {
  const { content } = useSiteContent()
  const { about } = content
  const ctaHref = about.ctaHref ?? '/about'
  const paragraphs = compact ? about.paragraphs.slice(0, 1) : about.paragraphs.slice(0, 2)

  return (
    <section
      className={`about-section${compact ? ' about-section--compact' : ''}`}
      aria-labelledby="about-section-title"
    >
      <div className="about-section__inner">
        <header className="about-section__header">
          <div className="about-section__heading-lockup">
            <img
              className="about-section__logo"
              src="/assets/logo_pat_content.png"
              alt="ProperTLV"
            />
            <div className="about-section__heading-copy">
              {about.accent && (
                <p className="about-section__accent orange-cursive-title orange-cursive-title--subtitle">
                  {about.accent}
                </p>
              )}
              <h2 id="about-section-title" className="about-section__title">
                {about.title}
              </h2>
              {!compact && about.subtitle && (
                <p className="about-section__subtitle">{about.subtitle}</p>
              )}
            </div>
          </div>
        </header>

        <div className={`about-section__body${compact ? ' about-section__body--compact' : ''}`}>
          <div className="about-section__copy">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          {!compact && (
            <ul className="about-section__highlights">
              {about.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        <Link to={ctaHref} className="about-section__cta">
          {about.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

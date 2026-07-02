import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import './AboutSection.css'

/** Homepage About Us — content from src/data/content (PLACEHOLDER_COPY) */
export default function AboutSection() {
  const { content } = useSiteContent()
  const { about } = content
  const ctaHref = about.ctaHref ?? '/about'

  return (
    <section className="about-section" aria-labelledby="about-section-title">
      <div className="about-section__inner">
        <header className="about-section__header">
          {about.accent && (
            <p className="about-section__accent orange-cursive-title orange-cursive-title--subtitle">
              {about.accent}
            </p>
          )}
          <h2 id="about-section-title" className="about-section__title">
            {about.title}
          </h2>
          {about.subtitle && <p className="about-section__subtitle">{about.subtitle}</p>}
        </header>

        <div className="about-section__body">
          <div className="about-section__copy">
            {about.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <ul className="about-section__highlights">
            {about.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <Link to={ctaHref} className="about-section__cta">
          {about.ctaLabel}
        </Link>
      </div>
    </section>
  )
}

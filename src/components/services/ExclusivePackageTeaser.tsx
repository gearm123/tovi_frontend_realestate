import { Link } from 'react-router-dom'
import { useSiteContent } from '../../hooks/useSiteContent'
import './ExclusivePackageTeaser.css'

/** Compact link-out on /services — full brochure lives on /sellers-package */
export default function ExclusivePackageTeaser() {
  const { content } = useSiteContent()
  const { exclusivityPackage, servicesPage } = content
  const { exclusivePackageTeaser } = servicesPage

  return (
    <article className="exclusive-teaser" aria-labelledby="exclusive-teaser-title">
      <div className="exclusive-teaser__inner">
        {exclusivityPackage.accent && (
          <p className="exclusive-teaser__accent orange-cursive-title orange-cursive-title--subtitle">
            {exclusivityPackage.accent}
          </p>
        )}
        <h2 id="exclusive-teaser-title" className="exclusive-teaser__title">
          {exclusivityPackage.title}
        </h2>
        {exclusivityPackage.packageDuration && (
          <p className="exclusive-teaser__duration">{exclusivityPackage.packageDuration}</p>
        )}
        <p className="exclusive-teaser__body">{exclusivePackageTeaser.body}</p>

        {exclusivityPackage.highlights.length > 0 && (
          <ul className="exclusive-teaser__highlights">
            {exclusivityPackage.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        <Link to={exclusivePackageTeaser.ctaHref} className="exclusive-teaser__cta">
          {exclusivePackageTeaser.ctaLabel}
        </Link>
      </div>

      {exclusivityPackage.heroImage && (
        <figure className="exclusive-teaser__media">
          <img
            src={exclusivityPackage.heroImage}
            alt={exclusivityPackage.heroImageAlt ?? exclusivityPackage.title}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
    </article>
  )
}

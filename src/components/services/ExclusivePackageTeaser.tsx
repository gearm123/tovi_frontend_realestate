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
        <h2 id="exclusive-teaser-title" className="exclusive-teaser__title">
          {exclusivityPackage.title}
        </h2>
        <p className="exclusive-teaser__body">{exclusivePackageTeaser.body}</p>

        <Link to={exclusivePackageTeaser.ctaHref} className="exclusive-teaser__cta site-cta">
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

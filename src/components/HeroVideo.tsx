import { HERO_IMAGE } from '../utils/propertyImages'
import './HeroVideo.css'

export default function HeroVideo() {
  return (
    <section className="hero" aria-label="Tel Aviv introduction">
      <picture className="hero__picture">
        <source
          media="(max-width: 768px)"
          srcSet={HERO_IMAGE.mobileWebp}
          type="image/webp"
        />
        <source srcSet={HERO_IMAGE.desktopWebp} type="image/webp" />
        <img
          src={HERO_IMAGE.fallback}
          alt="Tel Aviv — animation coming soon"
          className="hero__image"
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <a href="#listings" className="hero__scroll-hint">
        Scroll to listings
      </a>
    </section>
  )
}

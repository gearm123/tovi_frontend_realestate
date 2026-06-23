import { HERO_IMAGE } from '../utils/propertyImages'
import { useLanguage } from '../context/LanguageContext'
import './HeroVideo.css'

export default function HeroVideo() {
  const { t } = useLanguage()

  return (
    <section className="hero" aria-label={t.hero.aria}>
      <picture className="hero__picture">
        <source
          media="(max-width: 768px)"
          srcSet={HERO_IMAGE.mobileWebp}
          type="image/webp"
        />
        <source srcSet={HERO_IMAGE.desktopWebp} type="image/webp" />
        <img
          src={HERO_IMAGE.fallback}
          alt={t.hero.alt}
          className="hero__image"
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <a href="#listings" className="hero__scroll-hint">
        {t.hero.scrollHint}
      </a>
    </section>
  )
}

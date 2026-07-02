import { useState } from 'react'
import { HERO_IMAGE } from '../utils/propertyImages'
import { useLanguage } from '../context/LanguageContext'
import './HeroVideo.css'

export default function HeroVideo() {
  const { t } = useLanguage()
  const [imageSrc, setImageSrc] = useState<string>(HERO_IMAGE.fallback)

  return (
    <section className="hero" aria-label={t.hero.aria}>
      <div className="hero__media">
        <img
          src={imageSrc}
          alt={t.hero.alt}
          className="hero__image"
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (imageSrc !== HERO_IMAGE.fallbackAlt) {
              setImageSrc(HERO_IMAGE.fallbackAlt)
            }
          }}
        />
        <div className="hero__shade" aria-hidden="true" />
        <p className="hero__animation-placeholder">{t.hero.animationPlaceholder}</p>
      </div>

      <a href="#listings" className="hero__scroll-hint">
        {t.hero.scrollHint}
      </a>
    </section>
  )
}

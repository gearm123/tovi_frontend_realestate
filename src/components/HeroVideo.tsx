import { useEffect, useState } from 'react'
import { HERO_IMAGE, HERO_VIDEO } from '../utils/propertyImages'
import { useLanguage } from '../context/LanguageContext'
import './HeroVideo.css'

export default function HeroVideo() {
  const { t } = useLanguage()
  const [imageSrc, setImageSrc] = useState<string>(HERO_IMAGE.fallback)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const showStill = reduceMotion || videoFailed

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
        {!showStill && (
          <video
            className={`hero__video${videoReady ? ' hero__video--ready' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_IMAGE.fallback}
            aria-hidden="true"
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        <div className="hero__shade" aria-hidden="true" />
      </div>

      <a href="#listings" className="hero__scroll-hint">
        {t.hero.scrollHint}
      </a>
    </section>
  )
}

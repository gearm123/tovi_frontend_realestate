import './HeroVideo.css'

const HERO_STUB_SRC = '/assets/stub.png'

export default function HeroVideo() {
  return (
    <section className="hero" aria-label="Tel Aviv introduction">
      <img
        src={HERO_STUB_SRC}
        alt="Tel Aviv — animation coming soon"
        className="hero__image"
        decoding="async"
      />

      <a href="#listings" className="hero__scroll-hint">
        Scroll to listings
      </a>
    </section>
  )
}

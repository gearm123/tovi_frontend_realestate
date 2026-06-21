import './ListingsHeader.css'

export default function ListingsHeader() {
  return (
    <header className="listings-header">
      <p className="listings-header__section-label">This week&apos;s selection</p>
      <h2 className="listings-header__title">Properties for You</h2>
      <p className="listings-header__intro">
        Handpicked apartments and homes across Tel Aviv — each one chosen for
        its light, its neighborhood, and the life you might build there.
      </p>
    </header>
  )
}

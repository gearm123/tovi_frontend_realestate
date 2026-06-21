import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header__masthead">
        <h1 className="header__title">PropertyTLV</h1>
        <p className="header__tagline">Homes &amp; apartments, curated with care</p>
      </div>

      <nav className="header__nav" aria-label="Main navigation">
        <a href="#listings">Listings</a>
        <span className="header__nav-dot" aria-hidden="true" />
        <a href="#about">About</a>
        <span className="header__nav-dot" aria-hidden="true" />
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}

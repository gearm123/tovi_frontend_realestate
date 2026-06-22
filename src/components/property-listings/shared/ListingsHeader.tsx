import './ListingsHeader.css'

interface ListingsHeaderProps {
  sectionLabel: string
  title: string
  intro?: string
}

export default function ListingsHeader({
  sectionLabel,
  title,
  intro,
}: ListingsHeaderProps) {
  return (
    <header className="listings-header">
      <p className="listings-header__section-label">{sectionLabel}</p>
      <h2 className="listings-header__title">{title}</h2>
      {intro && <p className="listings-header__intro">{intro}</p>}
    </header>
  )
}

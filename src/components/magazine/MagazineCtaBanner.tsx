import { Link } from 'react-router-dom'
import type { MagazinePageContent } from '../../types/magazine'
import './MagazineCtaBanner.css'

interface MagazineCtaBannerProps {
  cta: MagazinePageContent['cta']
}

export default function MagazineCtaBanner({ cta }: MagazineCtaBannerProps) {
  return (
    <aside className="magazine-cta" aria-label={cta.title}>
      <div className="magazine-cta__inner">
        <h2 className="magazine-cta__title">{cta.title}</h2>
        <p className="magazine-cta__text">{cta.description}</p>
        <Link to={cta.href} className="magazine-cta__button">
          {cta.buttonLabel}
        </Link>
      </div>
    </aside>
  )
}

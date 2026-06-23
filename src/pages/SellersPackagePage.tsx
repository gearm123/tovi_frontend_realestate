import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import './SellersPackagePage.css'

export default function SellersPackagePage() {
  const { t } = useLanguage()

  return (
    <PageShell title={t.sellersPackage.title} subtitle={t.sellersPackage.subtitle}>
      <div className="sellers-package">
        <p>{t.sellersPackage.intro}</p>

        <ul className="sellers-package__list">
          {t.sellersPackage.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <Link to="/contact" className="sellers-package__cta">
          {t.sellersPackage.cta}
        </Link>
      </div>
    </PageShell>
  )
}

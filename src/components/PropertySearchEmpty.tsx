import { useLanguage } from '../context/LanguageContext'
import './PropertySearchEmpty.css'

interface PropertySearchEmptyProps {
  onReset: () => void
}

export default function PropertySearchEmpty({ onReset }: PropertySearchEmptyProps) {
  const { t } = useLanguage()

  return (
    <div className="property-search-empty" role="status">
      <p className="property-search-empty__title">{t.search.emptyTitle}</p>
      <p className="property-search-empty__text">{t.search.emptyText}</p>
      <button type="button" className="property-search-empty__reset" onClick={onReset}>
        {t.filters.clear}
      </button>
    </div>
  )
}

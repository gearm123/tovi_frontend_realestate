import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage()

  const isHebrew = locale === 'he'

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggleLocale}
      aria-label={
        isHebrew ? t.lang.ariaSwitchToEnglish : t.lang.ariaSwitchToHebrew
      }
    >
      <span className="lang-toggle__track" aria-hidden="true">
        <span
          className={`lang-toggle__thumb ${isHebrew ? 'lang-toggle__thumb--he' : ''}`}
        />
        <span
          className={`lang-toggle__option lang-toggle__option--en ${!isHebrew ? 'lang-toggle__option--active' : ''}`}
        >
          EN
        </span>
        <span
          className={`lang-toggle__option lang-toggle__option--he ${isHebrew ? 'lang-toggle__option--active' : ''}`}
        >
          עב
        </span>
      </span>
      <span className="lang-toggle__label">
        {isHebrew ? t.lang.switchToEnglish : t.lang.switchToHebrew}
      </span>
    </button>
  )
}

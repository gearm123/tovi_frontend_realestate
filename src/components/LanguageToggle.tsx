import type { CSSProperties } from 'react'
import { LOCALE_OPTIONS } from '../i18n/locales'
import { useLanguage } from '../context/LanguageContext'
import './LanguageToggle.css'

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()
  const activeIndex = LOCALE_OPTIONS.findIndex((option) => option.code === locale)

  return (
    <div className="lang-toggle" role="group" aria-label={t.lang.groupAria}>
      <div
        className="lang-toggle__track"
        style={{ '--lang-index': activeIndex } as CSSProperties}
      >
        <span className="lang-toggle__thumb" aria-hidden="true" />
        {LOCALE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            className={[
              'lang-toggle__option',
              `lang-toggle__option--${option.code}`,
              locale === option.code ? 'lang-toggle__option--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setLocale(option.code)}
            aria-label={t.lang[option.ariaKey]}
            aria-pressed={locale === option.code}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

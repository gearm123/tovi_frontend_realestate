import type { CSSProperties } from 'react'
import { LOCALE_OPTIONS } from '../../i18n/locales'
import { translations } from '../../i18n/translations'
import type { Locale } from '../../i18n/types'
import './LeadCaptureLanguageToggle.css'

interface LeadCaptureLanguageToggleProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export default function LeadCaptureLanguageToggle({
  locale,
  onLocaleChange,
}: LeadCaptureLanguageToggleProps) {
  const labels = translations[locale].lang
  const activeIndex = LOCALE_OPTIONS.findIndex((option) => option.code === locale)

  return (
    <div
      className="lead-capture-lang"
      role="group"
      aria-label={labels.groupAria}
      dir="ltr"
    >
      <div
        className="lead-capture-lang__track"
        style={{ '--lang-index': activeIndex } as CSSProperties}
      >
        <span className="lead-capture-lang__thumb" aria-hidden="true" />
        {LOCALE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            className={[
              'lead-capture-lang__option',
              locale === option.code ? 'lead-capture-lang__option--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onLocaleChange(option.code)}
            aria-label={labels[option.ariaKey]}
            aria-pressed={locale === option.code}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

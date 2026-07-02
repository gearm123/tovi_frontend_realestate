import { useEffect, useId, useRef, useState } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'
import { useLanguage } from '../../context/LanguageContext'
import './AccessibilityWidget.css'

function AccessibilityIcon() {
  return (
    <svg
      className="accessibility-widget__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="4.5" r="2" fill="currentColor" />
      <path
        fill="currentColor"
        d="M12 8.25c-2.8 0-5.2 1.8-6 4.3L4.5 14a.75.75 0 0 0 1.45.38l1.1-3.45h10l1.1 3.45a.75.75 0 1 0 1.45-.38l-1.5-1.45c-.8-2.5-3.2-4.3-6-4.3Zm-2.2 9.9a.75.75 0 0 0-.95.95l1.2 1.55a3.25 3.25 0 0 0 5.1 0l1.2-1.55a.75.75 0 1 0-1.18-.92l-1.2 1.55a1.75 1.75 0 0 1-2.74 0l-1.2-1.55a.75.75 0 0 0-.95-.95Z"
      />
    </svg>
  )
}

export default function AccessibilityWidget() {
  const { t } = useLanguage()
  const {
    settings,
    increaseTextSize,
    decreaseTextSize,
    toggleHighContrast,
    toggleUnderlineLinks,
    toggleReadableFont,
    resetSettings,
    canIncreaseText,
    canDecreaseText,
  } = useAccessibility()

  const [open, setOpen] = useState(false)
  const panelId = useId()
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const toggleLabel = (enabled: boolean) => (enabled ? t.accessibility.on : t.accessibility.off)

  return (
    <div className="accessibility-widget">
      <button
        ref={triggerRef}
        type="button"
        className="accessibility-widget__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <AccessibilityIcon />
        <span className="accessibility-widget__trigger-label">{t.accessibility.openMenu}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          className="accessibility-widget__panel"
        >
          <header className="accessibility-widget__header">
            <h2 id={titleId} className="accessibility-widget__title">
              {t.accessibility.title}
            </h2>
            <button
              type="button"
              className="accessibility-widget__close"
              onClick={() => {
                setOpen(false)
                triggerRef.current?.focus()
              }}
            >
              {t.accessibility.closeMenu}
            </button>
          </header>

          <div className="accessibility-widget__controls">
            <div className="accessibility-widget__group">
              <span className="accessibility-widget__group-label" id={`${panelId}-text-size`}>
                {t.accessibility.textSize}
              </span>
              <div className="accessibility-widget__row" role="group" aria-labelledby={`${panelId}-text-size`}>
                <button
                  type="button"
                  className="accessibility-widget__action"
                  onClick={decreaseTextSize}
                  disabled={!canDecreaseText}
                  aria-label={t.accessibility.decreaseText}
                >
                  A−
                </button>
                <button
                  type="button"
                  className="accessibility-widget__action"
                  onClick={increaseTextSize}
                  disabled={!canIncreaseText}
                  aria-label={t.accessibility.increaseText}
                >
                  A+
                </button>
              </div>
            </div>

            <button
              type="button"
              className="accessibility-widget__toggle"
              aria-pressed={settings.highContrast}
              onClick={toggleHighContrast}
            >
              <span>{t.accessibility.highContrast}</span>
              <span className="accessibility-widget__state">{toggleLabel(settings.highContrast)}</span>
            </button>

            <button
              type="button"
              className="accessibility-widget__toggle"
              aria-pressed={settings.underlineLinks}
              onClick={toggleUnderlineLinks}
            >
              <span>{t.accessibility.underlineLinks}</span>
              <span className="accessibility-widget__state">{toggleLabel(settings.underlineLinks)}</span>
            </button>

            <button
              type="button"
              className="accessibility-widget__toggle"
              aria-pressed={settings.readableFont}
              onClick={toggleReadableFont}
            >
              <span>{t.accessibility.readableFont}</span>
              <span className="accessibility-widget__state">{toggleLabel(settings.readableFont)}</span>
            </button>
          </div>

          <footer className="accessibility-widget__footer">
            <button type="button" className="accessibility-widget__reset" onClick={resetSettings}>
              {t.accessibility.reset}
            </button>
            <p className="accessibility-widget__disclaimer">{t.accessibility.disclaimer}</p>
          </footer>
        </div>
      )}
    </div>
  )
}

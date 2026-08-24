import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { getLeadCaptureSettings } from '../../lib/siteDataStore'
import { getDir, translations } from '../../i18n/translations'
import type { Locale } from '../../i18n/types'
import { shouldShowLeadCaptureOnPage } from '../../lib/leadCapturePages'
import {
  buildLeadCaptureWhatsAppUrl,
  getLeadCapturePayloadFromForm,
  submitLeadCapture,
} from '../../services/leadCaptureService'
import LeadCaptureLanguageToggle from './LeadCaptureLanguageToggle'
import './LeadCapturePopup.css'

const SESSION_SUBMITTED_KEY = 'propertlv-lead-capture-submitted'
const SESSION_SEEN_KEY = 'propertlv-lead-capture-seen'
const DEFAULT_POPUP_LOCALE: Locale = 'he'

function wasShownThisSession(): boolean {
  try {
    return (
      sessionStorage.getItem(SESSION_SEEN_KEY) === '1' ||
      sessionStorage.getItem(SESSION_SUBMITTED_KEY) === '1'
    )
  } catch {
    return false
  }
}

function markShownThisSession(): void {
  try {
    sessionStorage.setItem(SESSION_SEEN_KEY, '1')
  } catch {
    /* private mode / blocked storage */
  }
}

export default function LeadCapturePopup() {
  const { pathname } = useLocation()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(false)
  const [popupLocale, setPopupLocale] = useState<Locale>(DEFAULT_POPUP_LOCALE)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

  const popupT = translations[popupLocale]
  const popupDir = getDir(popupLocale)

  useEffect(() => {
    if (wasShownThisSession()) return undefined

    const delayMs = getLeadCaptureSettings().delayMs
    const timer = window.setTimeout(() => {
      if (wasShownThisSession()) return
      if (!shouldShowLeadCaptureOnPage(window.location.pathname)) return
      markShownThisSession()
      setOpen(true)
    }, delayMs)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    setPopupLocale(DEFAULT_POPUP_LOCALE)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleDismiss()
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleDismiss = () => {
    markShownThisSession()
    setOpen(false)
    setStatus('idle')
    setWhatsappUrl(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')

    const payload = getLeadCapturePayloadFromForm(event.currentTarget)
    const nextWhatsappUrl = buildLeadCaptureWhatsAppUrl(payload)
    const ok = await submitLeadCapture(event.currentTarget)

    if (!ok) {
      setStatus('error')
      return
    }

    window.open(nextWhatsappUrl, '_blank', 'noopener,noreferrer')

    sessionStorage.setItem(SESSION_SUBMITTED_KEY, '1')
    setWhatsappUrl(nextWhatsappUrl)
    setStatus('success')
  }

  if (!open) return null

  return (
    <div className="lead-capture-popup" role="presentation">
      <button
        type="button"
        className="lead-capture-popup__backdrop"
        aria-label={popupT.leadCapturePopup.closeAria}
        onClick={handleDismiss}
      />

      <div
        ref={dialogRef}
        className="lead-capture-popup__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={popupDir}
      >
        <div className="lead-capture-popup__toolbar" dir="ltr">
          <button
            ref={closeButtonRef}
            type="button"
            className="lead-capture-popup__close"
            aria-label={popupT.leadCapturePopup.closeAria}
            onClick={handleDismiss}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="lead-capture-popup__lang">
            <LeadCaptureLanguageToggle
              locale={popupLocale}
              onLocaleChange={setPopupLocale}
            />
          </div>
        </div>

        {status === 'success' ? (
          <div className="lead-capture-popup__success" role="status">
            <p className="lead-capture-popup__accent orange-cursive-title orange-cursive-title--subtitle">
              {popupT.leadCapturePopup.accent}
            </p>
            <h2 id={titleId} className="lead-capture-popup__title">
              {popupT.leadCapturePopup.successTitle}
            </h2>
            <p className="lead-capture-popup__subtitle">{popupT.leadCapturePopup.successHint}</p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                className="lead-capture-popup__whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                {popupT.leadCapturePopup.whatsappAction}
              </a>
            )}
            <button
              type="button"
              className="lead-capture-popup__submit"
              onClick={handleDismiss}
            >
              {popupT.leadCapturePopup.dismiss}
            </button>
          </div>
        ) : (
          <>
            <header className="lead-capture-popup__header">
              <p className="lead-capture-popup__accent orange-cursive-title orange-cursive-title--subtitle">
                {popupT.leadCapturePopup.accent}
              </p>
              <h2 id={titleId} className="lead-capture-popup__title">
                {popupT.leadCapturePopup.title}
              </h2>
              <p className="lead-capture-popup__subtitle">{popupT.leadCapturePopup.subtitle}</p>
            </header>

            <form
              className="lead-capture-popup__form"
              name="lead-capture"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="form-name" value="lead-capture" />
              <input
                type="hidden"
                name="recipientEmail"
                value={getLeadCaptureSettings().recipientEmail}
              />
              <input type="hidden" name="sourcePage" value={pathname} />
              <input type="hidden" name="interest" value={popupT.leadCapturePopup.interestLabel} />

              <p className="lead-capture-popup__honeypot" hidden>
                <label>
                  Do not fill this out:
                  <input name="bot-field" tabIndex={-1} autoComplete="off" />
                </label>
              </p>

              <label className="lead-capture-popup__field">
                <span>{popupT.leadCapturePopup.name}</span>
                <input type="text" name="name" required autoComplete="name" disabled={status === 'loading'} />
              </label>

              <label className="lead-capture-popup__field">
                <span>{popupT.leadCapturePopup.phone}</span>
                <input type="tel" name="phone" required autoComplete="tel" disabled={status === 'loading'} />
              </label>

              <label className="lead-capture-popup__field">
                <span>{popupT.leadCapturePopup.message}</span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder={popupT.leadCapturePopup.messagePlaceholder}
                  disabled={status === 'loading'}
                />
              </label>

              {status === 'error' && (
                <p className="lead-capture-popup__error" role="alert">
                  {popupT.leadCapturePopup.error}
                </p>
              )}

              <button
                type="submit"
                className="lead-capture-popup__submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? popupT.leadCapturePopup.submitting : popupT.leadCapturePopup.submit}
              </button>

              <p className="lead-capture-popup__footnote">{popupT.leadCapturePopup.footnote}</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import type { LeadCapturePageRule } from '../../config/leadCapturePopup'
import { useSiteData } from '../../hooks/useSiteData'
import { updateSiteData, type LeadCaptureSettings } from '../../lib/siteDataStore'
import './adminShared.css'

export default function AdminLeadCapturePage() {
  const { leadCapture } = useSiteData()
  const [form, setForm] = useState<LeadCaptureSettings>(leadCapture)
  const [pathsText, setPathsText] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(leadCapture)
    if (leadCapture.rule.mode === 'include' || leadCapture.rule.mode === 'exclude') {
      setPathsText(leadCapture.rule.paths.join('\n'))
    } else {
      setPathsText('')
    }
  }, [leadCapture])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    let rule: LeadCapturePageRule
    if (form.rule.mode === 'all') {
      rule = { mode: 'all' }
    } else {
      const paths = pathsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      rule = { mode: form.rule.mode, paths }
    }

    const next: LeadCaptureSettings = {
      ...form,
      rule,
      delayMs: Math.max(0, Number(form.delayMs) || 0),
      recipientEmail: form.recipientEmail.trim(),
    }

    updateSiteData((data) => ({ ...data, leadCapture: next }))
    setSaved(true)
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Lead capture popup</h1>
          <p className="admin-page__subtitle">
            Control the site-wide lead popup. Form submissions still go to Netlify Forms.
          </p>
        </div>
      </header>

      {saved ? (
        <p className="admin-notice admin-notice--success">Lead popup settings saved.</p>
      ) : null}

      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label className="admin-checkbox" htmlFor="lead-enabled">
                <input
                  id="lead-enabled"
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => {
                    setForm({ ...form, enabled: e.target.checked })
                    setSaved(false)
                  }}
                />
                Popup enabled
              </label>
            </div>
            <div className="admin-field">
              <label htmlFor="lead-delay">Delay (ms)</label>
              <input
                id="lead-delay"
                type="number"
                min={0}
                step={100}
                value={form.delayMs}
                onChange={(e) => {
                  setForm({ ...form, delayMs: Number(e.target.value) || 0 })
                  setSaved(false)
                }}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lead-email">Recipient email</label>
              <input
                id="lead-email"
                type="email"
                value={form.recipientEmail}
                onChange={(e) => {
                  setForm({ ...form, recipientEmail: e.target.value })
                  setSaved(false)
                }}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="lead-rule">Page rule</label>
              <select
                id="lead-rule"
                value={form.rule.mode}
                onChange={(e) => {
                  const mode = e.target.value as LeadCapturePageRule['mode']
                  setForm({
                    ...form,
                    rule:
                      mode === 'all'
                        ? { mode: 'all' }
                        : { mode, paths: pathsText.split('\n').filter(Boolean) },
                  })
                  setSaved(false)
                }}
              >
                <option value="all">All pages</option>
                <option value="include">Only listed paths</option>
                <option value="exclude">All except listed paths</option>
              </select>
            </div>
            {form.rule.mode !== 'all' ? (
              <div className="admin-field admin-field--full">
                <label htmlFor="lead-paths">Paths (one per line)</label>
                <textarea
                  id="lead-paths"
                  value={pathsText}
                  placeholder={'/contact\n/magazine/*'}
                  onChange={(e) => {
                    setPathsText(e.target.value)
                    setSaved(false)
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="admin-notice">
            Submitted leads appear in Netlify → Forms. This panel only controls popup behavior and
            the recipient email field on the form.
          </div>

          <div className="admin-form__footer">
            <button type="submit" className="admin-btn">
              Save lead popup settings
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

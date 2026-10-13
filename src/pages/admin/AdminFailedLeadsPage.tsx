import { useEffect, useState } from 'react'
import { deleteFailedLead, fetchFailedLeads } from '../../services/listingsApi'
import type { FailedLead } from '../../types/failedLead'
import './adminShared.css'

function formatWhen(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function AdminFailedLeadsPage() {
  const [leads, setLeads] = useState<FailedLead[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  const load = () => {
    setStatus('loading')
    setError('')
    fetchFailedLeads()
      .then((rows) => {
        setLeads(rows)
        setStatus('ready')
      })
      .catch((reason: unknown) => {
        setStatus('error')
        setError(reason instanceof Error ? reason.message : 'Could not load failed emails.')
      })
  }

  useEffect(() => {
    load()
  }, [])

  const handleRemove = async (lead: FailedLead) => {
    const ok = window.confirm(`Remove the saved lead from ${lead.name}?`)
    if (!ok) return
    setError('')
    try {
      await deleteFailedLead(lead.id)
      setLeads((current) => current.filter((item) => item.id !== lead.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not remove that lead.')
    }
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Failed emails</h1>
          <p className="admin-page__subtitle">
            Popup leads whose email did not send. The name, phone, and message are kept here.
          </p>
        </div>
      </header>

      {error ? <div className="admin-notice admin-notice--warn">{error}</div> : null}

      <section className="admin-card">
        {status === 'loading' ? (
          <p className="admin-empty">Loading failed emails…</p>
        ) : status === 'error' ? null : leads.length === 0 ? (
          <p className="admin-empty">No failed emails. A popup lead appears here only when its email does not send.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Page</th>
                  <th>Sent to</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{formatWhen(lead.createdAt)}</td>
                    <td>
                      <strong>{lead.name}</strong>
                    </td>
                    <td>{lead.phone}</td>
                    <td>{lead.message || '—'}</td>
                    <td>{lead.sourcePage || '—'}</td>
                    <td>{lead.recipientEmail || '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary admin-btn--small"
                        onClick={() => handleRemove(lead)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

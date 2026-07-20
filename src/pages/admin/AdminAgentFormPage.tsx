import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { createBlankAgent, slugifyId, updateSiteData } from '../../lib/siteDataStore'
import type { Agent } from '../../types/agent'
import './adminShared.css'

export default function AdminAgentFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { agents } = useSiteData()

  const existing = useMemo(
    () => (isNew ? undefined : agents.find((a) => a.id === id)),
    [isNew, agents, id],
  )

  const [form, setForm] = useState<Agent>(() => createBlankAgent())
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew) {
      setForm(createBlankAgent())
      return
    }
    if (existing) setForm(existing)
  }, [isNew, existing])

  if (!isNew && !existing) {
    return <Navigate to="/admin/agents" replace />
  }

  const setField = <K extends keyof Agent>(key: K, value: Agent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      window.alert('Name and email are required.')
      return
    }

    let nextId = form.id
    if (isNew) {
      const base = slugifyId(form.name) || `agent-${Date.now()}`
      nextId = agents.some((a) => a.id === base) ? `${base}-${Date.now()}` : base
    }

    const payload: Agent = {
      ...form,
      id: nextId,
      name: form.name.trim(),
      email: form.email.trim(),
      title: {
        en: form.title.en.trim(),
        he: form.title.he.trim(),
      },
      image: form.image?.trim() || undefined,
      imageAlt: {
        en: form.imageAlt?.en?.trim() || '',
        he: form.imageAlt?.he?.trim() || '',
      },
    }

    updateSiteData((data) => {
      if (isNew) {
        return { ...data, agents: [...data.agents, payload] }
      }
      return {
        ...data,
        agents: data.agents.map((a) => (a.id === payload.id ? payload : a)),
      }
    })

    setSaved(true)
    if (isNew) navigate(`/admin/agents/${payload.id}`, { replace: true })
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{isNew ? 'Add agent' : 'Edit agent'}</h1>
          <p className="admin-page__subtitle">
            {isNew ? 'Create a new listing agent profile.' : `Editing ${form.id}`}
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn admin-btn--secondary" to="/admin/agents">
            Back to agents
          </Link>
        </div>
      </header>

      {saved ? (
        <p className="admin-notice admin-notice--success">Agent saved.</p>
      ) : null}

      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="agent-name">Name</label>
              <input
                id="agent-name"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-email">Email</label>
              <input
                id="agent-email"
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-title-en">Title (English)</label>
              <input
                id="agent-title-en"
                value={form.title.en}
                onChange={(e) => setField('title', { ...form.title, en: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-title-he">Title (Hebrew)</label>
              <input
                id="agent-title-he"
                value={form.title.he}
                onChange={(e) => setField('title', { ...form.title, he: e.target.value })}
                dir="rtl"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-phone-display">Phone display</label>
              <input
                id="agent-phone-display"
                value={form.phone?.display ?? ''}
                onChange={(e) =>
                  setField('phone', {
                    display: e.target.value,
                    tel: form.phone?.tel ?? '',
                    whatsapp: form.phone?.whatsapp ?? '',
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-phone-whatsapp">WhatsApp digits</label>
              <input
                id="agent-phone-whatsapp"
                value={form.phone?.whatsapp ?? ''}
                placeholder="972586270099"
                onChange={(e) =>
                  setField('phone', {
                    display: form.phone?.display ?? '',
                    tel: form.phone?.tel ?? '',
                    whatsapp: e.target.value.replace(/\D/g, ''),
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-phone-tel">Tel (E.164)</label>
              <input
                id="agent-phone-tel"
                value={form.phone?.tel ?? ''}
                placeholder="+972586270099"
                onChange={(e) =>
                  setField('phone', {
                    display: form.phone?.display ?? '',
                    tel: e.target.value,
                    whatsapp: form.phone?.whatsapp ?? '',
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="agent-image">Photo path / URL</label>
              <input
                id="agent-image"
                value={form.image ?? ''}
                placeholder="/assets/team/name.jpg"
                onChange={(e) => setField('image', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__footer">
            <button type="submit" className="admin-btn">
              {isNew ? 'Create agent' : 'Save changes'}
            </button>
            <Link className="admin-btn admin-btn--secondary" to="/admin/agents">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}

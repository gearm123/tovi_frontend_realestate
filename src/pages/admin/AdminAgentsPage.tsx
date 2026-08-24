import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { updateSiteData } from '../../lib/siteDataStore'
import './adminShared.css'

export default function AdminAgentsPage() {
  const { agents, properties, defaultAgentId } = useSiteData()

  const handleDelete = (id: string, name: string) => {
    const assigned = properties.filter((p) => p.agentId === id).length
    if (assigned > 0) {
      window.alert(
        `Cannot delete “${name}”. ${assigned} listing(s) still assigned to this agent. Reassign them first.`,
      )
      return
    }
    if (id === defaultAgentId) {
      window.alert('Cannot delete the default agent. Set another default first.')
      return
    }
    const ok = window.confirm(`Delete agent “${name}”?`)
    if (!ok) return
    updateSiteData((data) => ({
      ...data,
      agents: data.agents.filter((a) => a.id !== id),
    }))
  }

  const setDefault = (id: string) => {
    updateSiteData((data) => ({ ...data, defaultAgentId: id }))
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Agents</h1>
          <p className="admin-page__subtitle">
            Agents receive listing inquiries by email and WhatsApp routing.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn" to="/admin/agents/new">
            Add agent
          </Link>
        </div>
      </header>

      <section className="admin-card">
        {agents.length === 0 ? (
          <p className="admin-empty">No agents yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Title (EN)</th>
                  <th>Listings</th>
                  <th>Default</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => {
                  const count = properties.filter((p) => p.agentId === agent.id).length
                  return (
                    <tr key={agent.id}>
                      <td>
                        <strong>{agent.name || '(Unnamed)'}</strong>
                        <div style={{ color: '#646970', fontSize: 12 }}>{agent.id}</div>
                      </td>
                      <td>{agent.email}</td>
                      <td>{agent.title.en}</td>
                      <td>{count}</td>
                      <td>
                        {agent.id === defaultAgentId ? (
                          <span className="admin-badge admin-badge--featured">Default</span>
                        ) : (
                          <button
                            type="button"
                            className="admin-btn admin-btn--secondary admin-btn--small"
                            onClick={() => setDefault(agent.id)}
                          >
                            Make default
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <Link
                            className="admin-btn admin-btn--secondary admin-btn--small"
                            to={`/admin/agents/${agent.id}`}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--small"
                            onClick={() => handleDelete(agent.id, agent.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

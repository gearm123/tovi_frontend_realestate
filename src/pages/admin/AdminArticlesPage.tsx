import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import { refreshArticles, removeCachedArticle } from '../../lib/siteDataStore'
import { deleteArticle } from '../../services/listingsApi'
import './adminShared.css'

export default function AdminArticlesPage() {
  const { articles, articlesStatus, articlesError } = useSiteData()
  const [actionError, setActionError] = useState('')

  const handleDelete = async (id: string, title: string) => {
    const ok = window.confirm(`Delete “${title || id}”? It will leave the magazine.`)
    if (!ok) return
    setActionError('')
    try {
      await deleteArticle(id)
      removeCachedArticle(id)
      await refreshArticles()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not delete that article.')
    }
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Magazine</h1>
          <p className="admin-page__subtitle">
            Articles are written in English. Hebrew, French, and Russian are filled in when the
            article is saved.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn" to="/admin/magazine/new">
            Add article
          </Link>
        </div>
      </header>

      {articlesStatus === 'error' ? (
        <div className="admin-notice admin-notice--warn">{articlesError}</div>
      ) : null}
      {actionError ? <div className="admin-notice admin-notice--warn">{actionError}</div> : null}

      <section className="admin-card">
        {articlesStatus === 'loading' && articles.length === 0 ? (
          <p className="admin-empty">Loading articles…</p>
        ) : articles.length === 0 ? (
          <p className="admin-empty">No articles yet. Add the first story.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      {article.image ? (
                        <img className="admin-table__thumb" src={article.image} alt="" />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <strong>{article.title || '(Untitled)'}</strong>
                    </td>
                    <td>{article.category || '—'}</td>
                    <td>{article.date || '—'}</td>
                    <td>{article.type === 'video' ? 'Video' : 'Article'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <Link
                          className="admin-btn admin-btn--secondary admin-btn--small"
                          to={`/admin/magazine/${article.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger admin-btn--small"
                          onClick={() => handleDelete(article.id, article.title)}
                        >
                          Delete
                        </button>
                      </div>
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

import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import './MagazinePage.css'

export default function MagazinePage() {
  const { t } = useLanguage()

  return (
    <PageShell title={t.magazine.title} accent={t.magazine.accent} subtitle={t.magazine.subtitle}>
      <div className="magazine">
        {t.magazine.articles.map((article) => (
          <article key={article.title} className="magazine__card">
            <time className="magazine__date">{article.date}</time>
            <h2 className="magazine__title">{article.title}</h2>
            <p className="magazine__excerpt">{article.excerpt}</p>
            <button type="button" className="magazine__read-more">
              {t.magazine.readMore}
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

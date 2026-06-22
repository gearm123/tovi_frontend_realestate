import PageShell from '../components/PageShell'
import './MagazinePage.css'

const articles = [
  {
    title: 'Bauhaus Tel Aviv: A Living Heritage',
    excerpt:
      'How the White City\'s architectural legacy continues to shape modern living and property values.',
    date: 'March 2026',
  },
  {
    title: 'Neighbourhood Guide: Florentin',
    excerpt:
      'From artist studios to rooftop bars — why creatives and young professionals are calling Florentin home.',
    date: 'February 2026',
  },
  {
    title: 'The Rental Market in 2026',
    excerpt:
      'What buyers and renters need to know about prices, demand, and emerging hotspots across the city.',
    date: 'January 2026',
  },
]

export default function MagazinePage() {
  return (
    <PageShell
      title="PROPERTLV Magazine"
      subtitle="Stories, guides, and insights from Tel Aviv's property scene."
    >
      <div className="magazine">
        {articles.map((article) => (
          <article key={article.title} className="magazine__card">
            <time className="magazine__date">{article.date}</time>
            <h2 className="magazine__title">{article.title}</h2>
            <p className="magazine__excerpt">{article.excerpt}</p>
            <button type="button" className="magazine__read-more">
              Read more
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  )
}

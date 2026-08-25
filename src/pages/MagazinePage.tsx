import PageShell from '../components/PageShell'
import ArticleCard from '../components/magazine/ArticleCard'
import MagazineCtaBanner from '../components/magazine/MagazineCtaBanner'
import { useSiteContent } from '../hooks/useSiteContent'
import { getMagazineArticles } from '../services/magazineService'
import './MagazinePage.css'

export default function MagazinePage() {
  const { content, locale } = useSiteContent()
  const { magazinePage } = content
  const articles = getMagazineArticles(locale)

  return (
    <>
      <PageShell title={magazinePage.title} seoKey="magazine" />
      <div className="magazine-page">
        <div className="magazine-page__grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              readMoreLabel={magazinePage.readMore}
              watchVideoLabel={magazinePage.watchVideo}
              videoBadgeLabel={magazinePage.videoLabel}
              placeholderLabel={magazinePage.placeholderLabel}
            />
          ))}
        </div>
        <MagazineCtaBanner cta={magazinePage.cta} />
      </div>
    </>
  )
}

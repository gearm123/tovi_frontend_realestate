import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArticleVideo from '../components/magazine/ArticleVideo'
import MagazineCtaBanner from '../components/magazine/MagazineCtaBanner'
import PageSeo from '../components/seo/PageSeo'
import { useSiteContent } from '../hooks/useSiteContent'
import { getMagazineArticleBySlug } from '../services/magazineService'
import { buildArticleJsonLd } from '../seo/structuredData'
import './MagazineArticlePage.css'

export default function MagazineArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { content, locale } = useSiteContent()
  const { magazinePage } = content
  const article = slug ? getMagazineArticleBySlug(slug, locale) : undefined

  if (!article) {
    return (
      <>
        <PageSeo
          title={magazinePage.articleNotFound}
          description={magazinePage.backToMagazine}
          path="/magazine"
          noIndex
        />
        <div className="magazine-article magazine-article--missing">
          <h1>{magazinePage.articleNotFound}</h1>
          <Link to="/magazine">{magazinePage.backToMagazine}</Link>
        </div>
      </>
    )
  }

  const articlePath = `/magazine/${article.slug}`
  const showVideo = article.type === 'video' && article.videoUrl
  const articleJsonLd = useMemo(
    () => buildArticleJsonLd(article, articlePath),
    [article, articlePath],
  )

  return (
    <>
      <PageSeo
        title={`${article.title} — ProperTLV Magazine`}
        description={article.excerpt}
        path={articlePath}
        image={article.image}
        type="article"
        jsonLd={articleJsonLd}
      />
    <article className="magazine-article">
      <header className="magazine-article__header">
        <div className="magazine-article__meta">
          <span className="magazine-article__category">{article.category}</span>
          <time dateTime={article.date}>{article.date}</time>
          {article.isPlaceholder && (
            <span className="magazine-article__placeholder-tag">
              {magazinePage.placeholderLabel}
            </span>
          )}
          {article.type === 'video' && (
            <span className="magazine-article__video-tag">{magazinePage.videoLabel}</span>
          )}
        </div>
        <h1 className="magazine-article__title">{article.title}</h1>
        <p className="magazine-article__excerpt">{article.excerpt}</p>
      </header>

      {showVideo ? (
        <ArticleVideo
          videoUrl={article.videoUrl!}
          title={article.title}
          className="magazine-article__video"
        />
      ) : (
        <div className="magazine-article__hero">
          <img src={article.image} alt="" className="magazine-article__hero-image" />
        </div>
      )}

      <div className="magazine-article__body">
        {article.body.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>

      <footer className="magazine-article__footer">
        <Link to="/magazine" className="magazine-article__back">
          {magazinePage.backToMagazine}
        </Link>
      </footer>

      <MagazineCtaBanner cta={magazinePage.cta} />
    </article>
    </>
  )
}

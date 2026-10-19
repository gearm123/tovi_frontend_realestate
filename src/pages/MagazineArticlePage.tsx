import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ArticleVideo from '../components/magazine/ArticleVideo'
import MagazineCtaBanner from '../components/magazine/MagazineCtaBanner'
import PageSeo from '../components/seo/PageSeo'
import { useSiteContent } from '../hooks/useSiteContent'
import { useSiteData } from '../hooks/useSiteData'
import { articleForLocale, captionForImage, galleryFromArticle, isProjectArticle } from '../lib/magazineArticles'
import ProjectArticleContact from '../components/magazine/ProjectArticleContact'
import { buildArticleJsonLd } from '../seo/structuredData'
import './MagazineArticlePage.css'

export default function MagazineArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { content, locale } = useSiteContent()
  const { articles, articlesStatus } = useSiteData()
  const { magazinePage } = content
  const stored = slug ? articles.find((item) => item.slug === slug) : undefined
  const redirected =
    !stored && slug ? articles.find((item) => item.previousSlugs?.includes(slug)) : undefined
  const article = stored ? articleForLocale(stored, locale) : undefined
  const articlePath = article ? `/magazine/${article.slug}` : '/magazine'
  const articleJsonLd = useMemo(
    () => (article ? buildArticleJsonLd(article, articlePath) : null),
    [article, articlePath],
  )

  if (redirected) {
    return <Navigate to={`/magazine/${redirected.slug}`} replace />
  }

  if (!article && articlesStatus === 'loading') {
    return <div className="magazine-article" aria-busy="true" />
  }

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

  const showVideo = article.type === 'video' && article.videoUrl
  const photos = galleryFromArticle(article)

  return (
    <>
      <PageSeo
        title={`${article.title} | ProperTLV Magazine`}
        description={article.excerpt}
        path={articlePath}
        image={article.image}
        type="article"
        jsonLd={articleJsonLd ?? undefined}
      />
    <article className="magazine-article" dir={locale === 'he' ? 'rtl' : 'ltr'} lang={locale}>
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
      ) : null}

      {photos.length ? (
        <div className="magazine-article__gallery">
          {photos.map((image, index) => {
            const caption = captionForImage(article, image, index, locale)
            return (
              <figure className="magazine-article__figure" key={`${image.src}-${index}`}>
                <img src={image.src} alt={caption || image.credit || ''} />
                {caption || image.credit ? (
                  <figcaption className="magazine-article__caption">
                    {caption ? <span>{caption}</span> : null}
                    {image.credit ? (
                      <span className="magazine-article__credit">{image.credit}</span>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            )
          })}
        </div>
      ) : null}

      <div className="magazine-article__body">
        {article.body.map((paragraph) =>
          paragraph.length < 48 && !paragraph.includes('.') ? (
            <h2 key={paragraph} className="magazine-article__subhead">
              {paragraph}
            </h2>
          ) : (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ),
        )}
      </div>

      {isProjectArticle(stored) ? <ProjectArticleContact locale={locale} /> : null}

      <footer className="magazine-article__footer">
        {article.source && (
          <p className="magazine-article__source">
            {article.source.credit}{' '}
            <a href={article.source.url} target="_blank" rel="noreferrer">
              {article.source.name}
            </a>
          </p>
        )}
        <Link to="/magazine" className="magazine-article__back">
          {magazinePage.backToMagazine}
        </Link>
      </footer>

      <MagazineCtaBanner cta={magazinePage.cta} />
    </article>
    </>
  )
}

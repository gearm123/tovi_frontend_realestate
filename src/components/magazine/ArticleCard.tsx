import { Link } from 'react-router-dom'
import type { MagazineArticle } from '../../types/magazine'
import './ArticleCard.css'

interface ArticleCardProps {
  article: MagazineArticle
  readMoreLabel: string
  watchVideoLabel: string
  videoBadgeLabel: string
  placeholderLabel: string
}

export default function ArticleCard({
  article,
  readMoreLabel,
  watchVideoLabel,
  videoBadgeLabel,
  placeholderLabel,
}: ArticleCardProps) {
  const isVideo = article.type === 'video'
  const actionLabel = isVideo ? watchVideoLabel : readMoreLabel

  return (
    <article className={`article-card${isVideo ? ' article-card--video' : ''}`}>
      <Link to={`/magazine/${article.slug}`} className="article-card__media-link">
        <div className="article-card__media">
          <img
            src={article.image}
            alt=""
            className="article-card__image"
            loading="lazy"
            decoding="async"
          />
          {isVideo && (
            <span className="article-card__play" aria-hidden="true">
              ▶
            </span>
          )}
          {isVideo && (
            <span className="article-card__video-badge">{videoBadgeLabel}</span>
          )}
        </div>
      </Link>

      <div className="article-card__body">
        {article.isPlaceholder && (
          <span className="article-card__placeholder-tag">{placeholderLabel}</span>
        )}
        <div className="article-card__meta">
          <span className="article-card__category">{article.category}</span>
          <time className="article-card__date" dateTime={article.date}>
            {article.date}
          </time>
        </div>

        <h2 className="article-card__title">
          <Link to={`/magazine/${article.slug}`}>{article.title}</Link>
        </h2>

        <p className="article-card__excerpt">{article.excerpt}</p>

        <Link to={`/magazine/${article.slug}`} className="article-card__action">
          {actionLabel}
        </Link>
      </div>
    </article>
  )
}

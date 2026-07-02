import { useSiteContent } from '../../hooks/useSiteContent'
import ReviewCard from './ReviewCard'
import './ReviewsSection.css'

/** Client testimonials — PLACEHOLDER_COPY in src/data/content until real reviews are added */
export default function ReviewsSection() {
  const { content } = useSiteContent()
  const { reviews } = content
  const { googleReviews } = reviews

  return (
    <section className="reviews-section" aria-labelledby="reviews-section-title">
      <header className="reviews-section__header">
        {reviews.accent && (
          <p className="reviews-section__accent orange-cursive-title orange-cursive-title--subtitle">
            {reviews.accent}
          </p>
        )}
        <h2 id="reviews-section-title" className="reviews-section__title">
          {reviews.title}
        </h2>
        {reviews.subtitle && <p className="reviews-section__subtitle">{reviews.subtitle}</p>}
      </header>

      <div className="reviews-section__grid">
        {reviews.items.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            placeholderLabel={reviews.placeholderLabel}
          />
        ))}
      </div>

      {googleReviews.showButton && (
        <div className="reviews-section__google">
          <a
            href={googleReviews.url}
            className="reviews-section__google-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {googleReviews.buttonLabel}
          </a>
          <p className="reviews-section__google-note">{googleReviews.note}</p>
        </div>
      )}
    </section>
  )
}

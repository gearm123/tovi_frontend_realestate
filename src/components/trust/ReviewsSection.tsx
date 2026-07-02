import { CONTACT_PLACEHOLDERS } from '../../data/placeholders'
import { useSiteContent } from '../../hooks/useSiteContent'
import ReviewCard from './ReviewCard'
import './ReviewsSection.css'

/** Client testimonials — PLACEHOLDER_COPY in src/data/content until real reviews are added */
export default function ReviewsSection() {
  const { content } = useSiteContent()
  const { reviews } = content
  const { googleReviews } = reviews
  const showGoogleButton =
    googleReviews.showButton && !CONTACT_PLACEHOLDERS.googleReviews

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

      {showGoogleButton ? (
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
      ) : (
        googleReviews.showButton && (
          <p className="reviews-section__google-note reviews-section__google-note--only">
            {googleReviews.note}
          </p>
        )
      )}
    </section>
  )
}

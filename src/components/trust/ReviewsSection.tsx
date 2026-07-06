import { CONTACT_PLACEHOLDERS } from '../../data/placeholders'
import { useSiteContent } from '../../hooks/useSiteContent'
import GoogleReviewsBanner from './GoogleReviewsBanner'
import ReviewCard from './ReviewCard'
import './ReviewsSection.css'

interface ReviewsSectionProps {
  id?: string
  variant?: 'default' | 'embedded'
  showGoogleButton?: boolean
}

/** Client testimonials — PLACEHOLDER_COPY in src/data/content until real reviews are added */
export default function ReviewsSection({
  id = 'reviews-section',
  variant = 'default',
  showGoogleButton,
}: ReviewsSectionProps) {
  const { content } = useSiteContent()
  const { reviews } = content
  const { googleReviews } = reviews
  const shouldShowGoogleButton =
    showGoogleButton ??
    (googleReviews.showButton && !CONTACT_PLACEHOLDERS.googleReviews)

  return (
    <section
      id={id}
      className={`reviews-section reviews-section--${variant}`}
      aria-labelledby={`${id}-title`}
    >
      <header className="reviews-section__header">
        {reviews.accent && (
          <p className="reviews-section__accent orange-cursive-title orange-cursive-title--subtitle">
            {reviews.accent}
          </p>
        )}
        <h2 id={`${id}-title`} className="reviews-section__title">
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

      {shouldShowGoogleButton && (
        <GoogleReviewsBanner googleReviews={googleReviews} />
      )}
    </section>
  )
}

import type { ReviewItem } from '../../types/content'
import './ReviewCard.css'

interface ReviewCardProps {
  review: ReviewItem
  placeholderLabel: string
  maxQuoteLength?: number
}

function truncateQuote(quote: string, maxLength?: number) {
  if (!maxLength || quote.length <= maxLength) return quote
  const clipped = quote.slice(0, maxLength).replace(/\s+\S*$/, '')
  return `${clipped}…`
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="review-card__stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`review-card__star${i < rating ? ' review-card__star--filled' : ''}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewCard({
  review,
  placeholderLabel,
  maxQuoteLength,
}: ReviewCardProps) {
  return (
    <blockquote className="review-card">
      {review.isPlaceholder && (
        <span className="review-card__placeholder-tag">{placeholderLabel}</span>
      )}
      <StarRating rating={review.rating} />
      <p className="review-card__quote">&ldquo;{truncateQuote(review.quote, maxQuoteLength)}&rdquo;</p>
      <footer className="review-card__footer">
        <cite className="review-card__author">{review.author}</cite>
        {review.role && <span className="review-card__role">{review.role}</span>}
      </footer>
    </blockquote>
  )
}

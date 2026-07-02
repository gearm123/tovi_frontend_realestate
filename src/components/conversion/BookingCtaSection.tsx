import { Link } from 'react-router-dom'
import type { BookingSection } from '../../types/content'
import { getBookingUrl, isBookingPlaceholder } from '../../services/bookingService'
import './BookingCtaSection.css'

interface BookingCtaSectionProps {
  content: BookingSection
  compact?: boolean
}

export default function BookingCtaSection({
  content,
  compact = false,
}: BookingCtaSectionProps) {
  const bookingUrl = getBookingUrl()
  const isPlaceholder = isBookingPlaceholder()

  return (
    <section
      className={`booking-cta${compact ? ' booking-cta--compact' : ''}`}
      aria-labelledby="booking-cta-title"
    >
      <div className="booking-cta__inner">
        {content.accent && <p className="booking-cta__accent">{content.accent}</p>}
        <h2 id="booking-cta-title" className="booking-cta__title">
          {content.title}
        </h2>
        <p className="booking-cta__description">{content.description}</p>
        {isPlaceholder ? (
          <Link to="/contact" className="booking-cta__button">
            {content.buttonLabel}
          </Link>
        ) : (
          <a
            href={bookingUrl}
            className="booking-cta__button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.buttonLabel}
          </a>
        )}
        {isPlaceholder && content.placeholderNote && (
          <p className="booking-cta__placeholder-note">{content.placeholderNote}</p>
        )}
        {content.footnote && <p className="booking-cta__footnote">{content.footnote}</p>}
      </div>
    </section>
  )
}

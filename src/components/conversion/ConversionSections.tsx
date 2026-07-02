import NewsletterSignupSection from './NewsletterSignupSection'
import BookingCtaSection from './BookingCtaSection'
import { useSiteContent } from '../../hooks/useSiteContent'
import './ConversionSections.css'

interface ConversionSectionsProps {
  variant?: 'split' | 'stacked'
  compact?: boolean
  showNewsletter?: boolean
  showBooking?: boolean
}

export default function ConversionSections({
  variant = 'stacked',
  compact = false,
  showNewsletter = true,
  showBooking = true,
}: ConversionSectionsProps) {
  const { content } = useSiteContent()

  if (!showNewsletter && !showBooking) return null

  return (
    <div
      className={[
        'conversion-sections',
        `conversion-sections--${variant}`,
        compact ? 'conversion-sections--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showNewsletter && (
        <NewsletterSignupSection content={content.newsletter} compact={compact} />
      )}
      {showBooking && <BookingCtaSection content={content.booking} compact={compact} />}
    </div>
  )
}

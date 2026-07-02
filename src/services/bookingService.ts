import { CONTACT_PLACEHOLDERS, PLACEHOLDER_BOOKING_URL } from '../data/placeholders'

/**
 * Booking / scheduling URL — replace PLACEHOLDER_BOOKING_URL when Calendly (or similar) is live.
 */
export function isBookingPlaceholder(): boolean {
  return CONTACT_PLACEHOLDERS.booking
}

export function getBookingUrl(): string {
  return PLACEHOLDER_BOOKING_URL
}

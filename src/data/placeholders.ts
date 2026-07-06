/**
 * Shared placeholder values — replace these when final client assets arrive.
 * Import from here instead of scattering magic strings across the codebase.
 */

/** Generic property photo when no listing image is available */
export const PLACEHOLDER_PROPERTY_IMAGE = '/assets/properties/1.jpg'

/** Default map center (Tel Aviv) for listings without exact coordinates */
export const PLACEHOLDER_MAP_CENTER = {
  lat: 32.0853,
  lng: 34.7818,
} as const

/** Slight coordinate offsets for demo pins (add to center per listing index) */
export const PLACEHOLDER_COORD_OFFSETS = [
  { lat: 0.012, lng: -0.018 },
  { lat: -0.008, lng: 0.014 },
  { lat: 0.021, lng: 0.006 },
  { lat: -0.015, lng: -0.011 },
  { lat: 0.005, lng: 0.022 },
  { lat: -0.019, lng: 0.009 },
] as const

/** Placeholder video URL — leave empty string until a tour is uploaded */
export const PLACEHOLDER_VIDEO_URL = ''

/** Demo tour URL for previewing video embeds on select listings */
export const PLACEHOLDER_DEMO_VIDEO_URL =
  'https://www.youtube.com/watch?v=L5k8vMkS70E'

export const PLACEHOLDER_EMAIL = 'office@propertlv.com'

export const PLACEHOLDER_ADDRESS = 'בן יהודה 83, תל אביב'

/** Social profile URLs */
export const PLACEHOLDER_SOCIAL = {
  instagram: 'https://www.instagram.com/proper.tlv?igsh=NHRjOTE5ZGRrZnpn',
  facebook: 'https://www.facebook.com/ProperTelAviv/',
  linkedin: 'https://www.linkedin.com/company/propertlv/',
} as const

// TODO(client): Replace with live Calendly or booking URL
export const PLACEHOLDER_BOOKING_URL =
  'https://calendly.com/placeholder-propertlv/consultation'

/** Flags for UI — set to false once real client details are in business.ts */
export const CONTACT_PLACEHOLDERS = {
  email: false,
  address: false,
  social: false,
  booking: true,
  googleReviews: false,
} as const

export function isPlaceholderUrl(url: string): boolean {
  return /placeholder/i.test(url)
}

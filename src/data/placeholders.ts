/**
 * Shared placeholder values — replace these when final client assets arrive.
 * Import from here instead of scattering magic strings across the codebase.
 */

/** Generic property photo when no listing image is available */
export const PLACEHOLDER_PROPERTY_IMAGE = '/assets/stub.png'

/** Default map center (Tel Aviv) for listings without exact coordinates */
export const PLACEHOLDER_MAP_CENTER = {
  lat: 32.0853,
  lng: 34.7818,
} as const

/** Slight coordinate offsets for demo pins (add to center per property index) */
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

/** Placeholder contact fields (swap in business.ts when confirmed) */
export const PLACEHOLDER_EMAIL = 'contact@propertlv.placeholder'
export const PLACEHOLDER_ADDRESS = 'Office address coming soon — Tel Aviv'

/** Social profile URLs — replace with live accounts */
export const PLACEHOLDER_SOCIAL = {
  instagram: 'https://instagram.com/placeholder',
  facebook: 'https://facebook.com/placeholder',
} as const

/** Google Business reviews URL — replace when client profile is live */
export const PLACEHOLDER_GOOGLE_REVIEWS_URL = 'https://g.page/placeholder-propertlv/review'

/** Flags for UI — set to false once real client details are in business.ts */
export const CONTACT_PLACEHOLDERS = {
  email: true,
  address: true,
  social: true,
} as const

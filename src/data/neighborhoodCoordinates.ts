import type { PropertyCoordinates } from '../types/property'

/** Approximate neighborhood centers across Tel Aviv — used when listing coordinates are missing */
export const NEIGHBORHOOD_COORDINATES: Record<string, PropertyCoordinates> = {
  'Lev HaIr': { lat: 32.064, lng: 34.774 },
  'Neve Tzedek': { lat: 32.058, lng: 34.765 },
  Namal: { lat: 32.097, lng: 34.775 },
  Tzameret: { lat: 32.095, lng: 34.79 },
  Florentin: { lat: 32.056, lng: 34.769 },
  'Ramat Aviv': { lat: 32.113, lng: 34.804 },
  'Old North': { lat: 32.088, lng: 34.774 },
  Sarona: { lat: 32.072, lng: 34.786 },
}

import type { Property, PropertyCoordinates } from '../types/property'
import {
  PLACEHOLDER_COORD_OFFSETS,
  PLACEHOLDER_DEMO_VIDEO_URL,
  PLACEHOLDER_MAP_CENTER,
  PLACEHOLDER_VIDEO_URL,
} from './placeholders'

export const neighborhoods = [
  'Lev HaIr',
  'Neve Tzedek',
  'Namal',
  'Tzameret',
  'Florentin',
  'Ramat Aviv',
  'Old North',
  'Sarona',
] as const

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'loft', label: 'Loft' },
] as const

/** Demo coordinate — Tel Aviv center + per-listing offset until real addresses are set */
function demoCoordinates(index: number): PropertyCoordinates {
  const offset = PLACEHOLDER_COORD_OFFSETS[index % PLACEHOLDER_COORD_OFFSETS.length]
  return {
    lat: PLACEHOLDER_MAP_CENTER.lat + offset.lat,
    lng: PLACEHOLDER_MAP_CENTER.lng + offset.lng,
  }
}

/** Demo listing photo — maps to /public/assets/properties/{id}.jpg */
function demoListingImage(stubId: number): string {
  return `/assets/properties/${stubId}.jpg`
}

/**
 * Demo property listings — replace titles, images, coordinates, and copy
 * when final client materials are available.
 * TODO(client): Replace demo listings with live CRM / MLS data.
 */
export const properties: Property[] = [
  {
    id: '1',
    title: 'Sunlit Bauhaus on Rothschild',
    neighborhood: 'Lev HaIr',
    address: 'Rothschild Blvd 42, Tel Aviv',
    price: '₪4,850,000',
    priceNumeric: 4850000,
    listingType: 'sale',
    propertyType: 'apartment',
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    area: 98,
    description:
      'A restored 1930s apartment with tall ceilings, original terrazzo floors, and a quiet balcony overlooking the boulevard.',
    image: demoListingImage(1),
    videoUrl: PLACEHOLDER_VIDEO_URL || PLACEHOLDER_DEMO_VIDEO_URL,
    coordinates: demoCoordinates(0),
    featured: true,
    features: {
      balcony: true,
      parking: false,
      elevator: true,
      mamad: true,
      miklat: true,
      petsAllowed: false,
    },
  },
  {
    id: '2',
    title: 'Garden-Level Duplex in Neve Tzedek',
    neighborhood: 'Neve Tzedek',
    address: 'Shabazi St 18, Tel Aviv',
    price: '₪6,200,000',
    priceNumeric: 6200000,
    listingType: 'sale',
    propertyType: 'duplex',
    rooms: 5,
    bedrooms: 4,
    bathrooms: 3,
    area: 142,
    description:
      'Two levels opening onto a private courtyard. Warm stone, soft plaster walls, and a kitchen made for long dinners.',
    image: demoListingImage(2),
    coordinates: demoCoordinates(1),
    featured: true,
    features: {
      balcony: true,
      parking: true,
      elevator: false,
      mamad: true,
      miklat: true,
      petsAllowed: true,
    },
  },
  {
    id: '3',
    title: 'Sea-Breeze Penthouse, Tel Aviv Port',
    neighborhood: 'Namal',
    address: "HaTa'arucha St 3, Tel Aviv",
    price: '₪8,950,000',
    priceNumeric: 8950000,
    listingType: 'sale',
    propertyType: 'penthouse',
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    area: 115,
    description:
      'Top-floor residence with wraparound terrace. Mediterranean views from your own rooftop garden.',
    image: demoListingImage(3),
    coordinates: demoCoordinates(2),
    features: {
      balcony: true,
      parking: true,
      elevator: true,
      mamad: true,
      miklat: true,
      petsAllowed: false,
    },
  },
  {
    id: '4',
    title: 'Quiet Corner in Old North',
    neighborhood: 'Tzameret',
    address: 'Ben Yehuda St 156, Tel Aviv',
    price: '₪3,650,000',
    priceNumeric: 3650000,
    listingType: 'sale',
    propertyType: 'apartment',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    area: 72,
    description:
      'A gentle, tree-lined street minutes from the beach. Recently renovated with oak floors and a light-filled living space.',
    image: demoListingImage(4),
    coordinates: demoCoordinates(3),
    features: {
      balcony: false,
      parking: false,
      elevator: true,
      mamad: true,
      miklat: false,
      petsAllowed: true,
    },
  },
  {
    id: '5',
    title: 'Florentin Loft with Character',
    neighborhood: 'Florentin',
    address: 'Salame St 28, Tel Aviv',
    price: '₪2,980,000',
    priceNumeric: 2980000,
    listingType: 'sale',
    propertyType: 'loft',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    area: 68,
    description:
      'Exposed brick, steel beams, and a wall of windows in one of the city\'s most beloved quarters.',
    image: demoListingImage(5),
    coordinates: demoCoordinates(4),
    features: {
      balcony: true,
      parking: false,
      elevator: false,
      mamad: false,
      miklat: false,
      petsAllowed: true,
    },
  },
  {
    id: '6',
    title: 'Family Home near HaYarkon Park',
    neighborhood: 'Ramat Aviv',
    address: 'Einstein St 12, Tel Aviv',
    price: '₪5,400,000',
    priceNumeric: 5400000,
    listingType: 'sale',
    propertyType: 'house',
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    area: 128,
    description:
      'Spacious and serene — parks, schools, and the sea within easy reach.',
    image: demoListingImage(6),
    coordinates: demoCoordinates(5),
    features: {
      balcony: true,
      parking: true,
      elevator: false,
      mamad: true,
      miklat: true,
      petsAllowed: true,
    },
  },
  {
    id: 'r1',
    title: 'Bauhaus Rental on Rothschild',
    neighborhood: 'Lev HaIr',
    address: 'Rothschild Blvd 88, Tel Aviv',
    price: '₪12,500 / month',
    priceNumeric: 12500,
    listingType: 'rental',
    propertyType: 'apartment',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    description:
      'Elegant Bauhaus apartment with high ceilings and a shared rooftop terrace. Steps from cafés and galleries.',
    image: demoListingImage(1),
    coordinates: demoCoordinates(0),
    featured: true,
    features: {
      balcony: true,
      parking: false,
      elevator: true,
      mamad: true,
      miklat: true,
      petsAllowed: false,
    },
  },
  {
    id: 'r2',
    title: 'Modern Flat in Sarona',
    neighborhood: 'Sarona',
    address: 'Kaplan St 5, Tel Aviv',
    price: '₪18,000 / month',
    priceNumeric: 18000,
    listingType: 'rental',
    propertyType: 'apartment',
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    description:
      'Brand-new tower apartment overlooking the Sarona gardens. Floor-to-ceiling windows and underground parking.',
    image: demoListingImage(3),
    videoUrl: PLACEHOLDER_DEMO_VIDEO_URL,
    coordinates: demoCoordinates(1),
    features: {
      balcony: true,
      parking: true,
      elevator: true,
      mamad: true,
      miklat: true,
      petsAllowed: false,
    },
  },
  {
    id: 'r3',
    title: 'Charming Studio in Florentin',
    neighborhood: 'Florentin',
    address: 'Vital St 14, Tel Aviv',
    price: '₪6,800 / month',
    priceNumeric: 6800,
    listingType: 'rental',
    propertyType: 'apartment',
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    description:
      'Compact and bright studio in the creative heart of Florentin. Walkable nightlife and culture.',
    image: demoListingImage(5),
    coordinates: demoCoordinates(2),
    features: {
      balcony: false,
      parking: false,
      elevator: true,
      mamad: false,
      miklat: false,
      petsAllowed: true,
    },
  },
  {
    id: 'r4',
    title: 'Garden Apartment in Old North',
    neighborhood: 'Old North',
    address: 'Dizengoff St 210, Tel Aviv',
    price: '₪14,200 / month',
    priceNumeric: 14200,
    listingType: 'rental',
    propertyType: 'apartment',
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    area: 88,
    description:
      'Ground-floor apartment with a private garden. Quiet street, minutes from the beach and schools.',
    image: demoListingImage(4),
    coordinates: demoCoordinates(3),
    features: {
      balcony: true,
      parking: true,
      elevator: false,
      mamad: true,
      miklat: true,
      petsAllowed: true,
    },
  },
]

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export function getPropertiesByStatus(status: Property['listingType']): Property[] {
  return properties.filter((p) => p.listingType === status)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((p) => p.featured)
}

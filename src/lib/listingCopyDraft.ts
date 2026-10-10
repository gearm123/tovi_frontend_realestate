import type { Property } from '../types/property'
import { propertyTypes } from '../data/properties'
import { cleanListingText } from '../utils/listingCopy'

const typeLabel = (value: Property['propertyType']) =>
  propertyTypes.find((item) => item.value === value)?.label ?? value

function sentence(value: string): string {
  const text = cleanListingText(value).replace(/[.]+$/, '')
  if (!text) return ''
  return `${text}.`
}

/** Builds consistent listing copy from structured fields so staff do not format by hand. */
export function draftListingCopy(property: Property): {
  description: string
  highlights: string[]
} {
  const kind = typeLabel(property.propertyType).toLowerCase()
  const offer = property.listingType === 'rental' ? 'for rent' : 'for sale'
  const area = property.neighborhood?.trim()
  const size = property.area > 0 ? `${property.area} m²` : ''
  const rooms =
    property.rooms > 0 ? `${property.rooms} ${property.rooms === 1 ? 'room' : 'rooms'}` : ''
  const beds =
    property.bedrooms > 0
      ? `${property.bedrooms} ${property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`
      : ''
  const baths =
    property.bathrooms > 0
      ? `${property.bathrooms} ${property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`
      : ''
  const floor = property.floor?.trim()
    ? property.floor.trim().toLowerCase() === 'g' || /ground/i.test(property.floor)
      ? 'on the ground floor'
      : `on floor ${property.floor.trim()}`
    : ''

  const facts = [size, rooms, beds, baths].filter(Boolean).join(', ')
  const lead = [
    `This ${kind} ${offer}`,
    area ? `in ${area}` : '',
    floor,
    facts ? `offers ${facts}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  const extras: string[] = []
  if (property.features.parking) extras.push('parking')
  if (property.features.elevator) extras.push('an elevator')
  if (property.features.balcony) extras.push('a balcony')
  if (property.features.mamad) extras.push('a safe room')
  else if (property.features.miklat) extras.push('building shelter')
  if (property.features.petsAllowed) extras.push('pets allowed')

  const extraLine = extras.length
    ? `Features include ${extras.join(', ')}.`
    : ''

  const description = [sentence(lead), extraLine, property.address?.trim() ? `Located at ${property.address.trim()}.` : '']
    .filter(Boolean)
    .join(' ')

  const highlights = [
    facts,
    floor ? `Floor ${property.floor?.trim()}` : '',
    property.features.parking ? 'Parking' : '',
    property.features.elevator ? 'Elevator' : '',
    property.features.balcony ? 'Balcony' : '',
    property.features.mamad ? 'Safe room (Mamad)' : '',
    !property.features.mamad && property.features.miklat ? 'Building shelter' : '',
    property.features.petsAllowed ? 'Pets allowed' : '',
    property.exclusive ? 'Exclusive listing' : '',
    property.isNew ? 'New to market' : '',
  ].filter(Boolean)

  return {
    description: cleanListingText(description),
    highlights,
  }
}

export function linesToList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => cleanListingText(line.replace(/^[\s•\-–—*]+/, '')))
    .filter(Boolean)
}

export function listToLines(values?: string[]): string {
  return (values ?? []).join('\n')
}

function formatCount(value: number): string {
  const rounded = Math.round(value * 100) / 100
  return String(rounded)
}

function replaceEnglishCount(text: string, count: number, singular: string, plural: string): string {
  if (!(count > 0)) return text
  const label = count === 1 ? singular : plural
  const pattern = new RegExp(
    `\\d+(?:[.,]\\d+)?\\s+${plural}\\b|\\d+(?:[.,]\\d+)?\\s+${singular}\\b`,
    'gi',
  )
  return text.replace(pattern, `${formatCount(count)} ${label}`)
}

function replaceNounNumber(text: string, count: number, nouns: string): string {
  if (!(count > 0)) return text
  const pattern = new RegExp(`\\d+(?:[.,]\\d+)?(?=\\s+(?:${nouns}))`, 'gi')
  return text.replace(pattern, formatCount(count))
}

/** Keeps written listing copy aligned with the room counts entered in admin. */
export function applyStructuredCounts(
  text: string,
  property: Pick<Property, 'rooms' | 'bedrooms' | 'bathrooms'>,
): string {
  if (!text) return text
  let next = replaceEnglishCount(text, property.bathrooms, 'bathroom', 'bathrooms')
  next = replaceEnglishCount(next, property.bedrooms, 'bedroom', 'bedrooms')
  next = replaceEnglishCount(next, property.rooms, 'room', 'rooms')
  next = replaceNounNumber(next, property.bathrooms, 'חדרי רחצה|חדרי אמבטיה|salles de bain|salle de bain|ванные|ванная|ванных')
  next = replaceNounNumber(next, property.bedrooms, 'חדרי שינה|chambres|chambre|спальни|спальня|спален')
  next = replaceNounNumber(next, property.rooms, 'חדרים|חדר(?!י)|pièces|pièce|комнаты|комната|комнат(?!ы)|комн\\.')
  return next
}

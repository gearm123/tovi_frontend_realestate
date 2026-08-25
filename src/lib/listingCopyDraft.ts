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

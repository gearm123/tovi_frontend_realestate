import type { Property } from '../types/property'

const FIRST_CODE = 1001

export type ExistingListingReason = 'code' | 'same-listing'

export interface ExistingListingMatch {
  property: Property
  reason: ExistingListingReason
}

/** Turns 1001, pt1001, or PT-1001 into PT-1001. Anything else is blank. */
export function normalizePropertyCode(value: string): string {
  const compact = value.trim().toUpperCase().replace(/[\s_-]+/g, '')
  const digits = compact.replace(/^PT/, '')
  if (!/^\d{3,6}$/.test(digits)) return ''
  return `PT-${digits}`
}

export function propertyCodeNumber(value: string | undefined): number {
  const code = normalizePropertyCode(value ?? '')
  const number = Number(code.slice(3))
  return Number.isFinite(number) ? number : 0
}

export function nextPropertyCode(listings: Pick<Property, 'propertyCode'>[]): string {
  const highest = listings.reduce(
    (max, listing) => Math.max(max, propertyCodeNumber(listing.propertyCode)),
    FIRST_CODE - 1,
  )
  return `PT-${highest + 1}`
}

/** Fills missing IDs in list order. Listings that already have an ID keep it. */
export function assignPropertyCodes(listings: Property[]): Property[] {
  const used = new Set<string>()
  let next = FIRST_CODE
  return listings.map((listing) => {
    const existing = normalizePropertyCode(listing.propertyCode ?? '')
    if (existing && !used.has(existing)) {
      used.add(existing)
      return existing === listing.propertyCode ? listing : { ...listing, propertyCode: existing }
    }
    while (used.has(`PT-${next}`)) next += 1
    const propertyCode = `PT-${next}`
    used.add(propertyCode)
    next += 1
    return { ...listing, propertyCode }
  })
}

function sameText(left: string, right: string): boolean {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalize(left) === normalize(right)
}

export function findExistingListing(
  candidate: Pick<Property, 'id' | 'title' | 'address' | 'listingType' | 'propertyCode'>,
  listings: Property[],
): ExistingListingMatch | undefined {
  const code = normalizePropertyCode(candidate.propertyCode ?? '')
  const title = candidate.title.trim()
  const address = candidate.address.trim()
  const isNewListing = !listings.some((property) => property.id === candidate.id)

  for (const property of listings) {
    if (property.id === candidate.id) continue
    if (code && normalizePropertyCode(property.propertyCode ?? '') === code) {
      return { property, reason: 'code' }
    }
    if (
      isNewListing &&
      title &&
      address &&
      property.listingType === candidate.listingType &&
      sameText(property.title, title) &&
      sameText(property.address, address)
    ) {
      return { property, reason: 'same-listing' }
    }
  }
  return undefined
}

export function existingListingMessage(match: ExistingListingMatch): string {
  const code = match.property.propertyCode || match.property.id
  const title = match.property.title || 'Untitled'
  if (match.reason === 'code') {
    return `Property ID ${code} is already used by “${title}”. Publishing stays off until this ID is unique.`
  }
  return `This listing is already published as ${code} (“${title}”). Publishing stays off.`
}

export function propertyCodeMatches(propertyCode: string | undefined, query: string): boolean {
  const needle = query.trim().toUpperCase().replace(/[\s_-]/g, '')
  if (!needle) return true
  const code = (propertyCode ?? '').toUpperCase().replace(/[\s_-]/g, '')
  return code.includes(needle)
}

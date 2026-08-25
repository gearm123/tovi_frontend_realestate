import type { Property } from '../types/property'

export function withCleanedListingCopy(property: Property): Property {
  return {
    ...property,
    title: cleanListingText(property.title),
    address: cleanListingText(property.address),
    description: cleanListingText(property.description),
    floor: property.floor ? cleanListingText(property.floor) : property.floor,
    highlights: property.highlights?.map(cleanListingText).filter(Boolean),
    specialNotes: property.specialNotes?.map(cleanListingText).filter(Boolean),
  }
}

/** True when the string contains Hebrew letters. */
export function hasHebrew(value: string): boolean {
  return /[\u0590-\u05FF]/.test(value)
}

/** Listing copy is English unless it contains Hebrew. */
export function listingTextDir(value: string): 'ltr' | 'rtl' {
  return hasHebrew(value) ? 'rtl' : 'ltr'
}

/**
 * Scraped WordPress copy often turned emoji into "????".
 * Real questions are turned into periods so the sentence still reads cleanly.
 */
export function cleanListingText(value: string): string {
  if (!value) return value

  return value
    .replace(/\uFFFD/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ \t]*\?{2,}/g, '.')
    .replace(/([A-Za-z0-9'’”)])[ \t]*\?/g, '$1.')
    .replace(/([\u0590-\u05FF])[ \t]*\?/g, '$1.')
    .replace(/\?/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\.{2,}/g, '.')
    .replace(/[ \t]+\./g, '.')
    .replace(/\n[ \t]*\./g, '.')
    .trim()
}

export function listingExcerpt(value: string, maxChars = 240): {
  preview: string
  truncated: boolean
} {
  const trimmed = value.trim()
  if (trimmed.length <= maxChars) {
    return { preview: trimmed, truncated: false }
  }

  const paragraphs = trimmed.split(/\n\s*\n/)
  let acc = ''
  for (const paragraph of paragraphs) {
    const next = acc ? `${acc}\n\n${paragraph}` : paragraph
    if (next.length > maxChars) {
      if (acc) {
        return { preview: acc, truncated: true }
      }
      const cut = paragraph.slice(0, maxChars).replace(/\s+\S*$/, '')
      return { preview: `${cut}…`, truncated: true }
    }
    acc = next
  }

  return { preview: acc, truncated: false }
}

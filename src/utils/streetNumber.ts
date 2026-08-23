import type { Property } from '../types/property'

/** House-number token: 67, 12A, 9, 12-14 */
const HOUSE_NUMBER = '\\d+[A-Za-z]?(?:\\s*[-/]\\s*\\d+[A-Za-z]?)?'

const KEEP_PATTERNS = [
  /\b(?:19|20)\d{2}s?\b/g,
  /\b\d+(?:st|nd|rd|th)\b/gi,
  /\b\d+\s*\/\s*\d+\b/g,
  /\b\d+(?:[.,]\d+)?\s*(?:sqm|m\u00B2|sq\.?\s*m)\b/gi,
  /\b\d+(?:[.,]\d+)?-?\s*(?:rooms?|bedrooms?|beds?|bathrooms?|baths?|story|stories|floors?)\b/gi,
  /\b\d+\s*min(?:ute)?s?\b/gi,
  new RegExp(`\\b\\d+\\s*\u05d7\u05d3\u05e8(?:\u05d9\u05dd)?\\b`, 'g'),
]

function withPlaceholders(value: string): { text: string; restore: (input: string) => string } {
  const saved: string[] = []
  let text = value

  for (const pattern of KEEP_PATTERNS) {
    text = text.replace(new RegExp(pattern.source, pattern.flags), (match) => {
      saved.push(match)
      return `\u0000${saved.length - 1}\u0000`
    })
  }

  return {
    text,
    restore(input: string) {
      return input.replace(/\u0000(\d+)\u0000/g, (_, index: string) => saved[Number(index)] ?? '')
    },
  }
}

function tidy(value: string): string {
  return value
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
    .replace(/\s+\|\s+/g, ' | ')
    .replace(/\s+([\u2013\u2014-])\s+/g, ' $1 ')
    .replace(/^[,\s|\u2013\u2014-]+/, '')
    .replace(/[,\s|\u2013\u2014-]+$/, '')
    .trim()
}

/** Remove building / house numbers from a listing title or address. */
export function stripStreetNumber(value: string): string {
  if (!value) return value

  const { text, restore } = withPlaceholders(value)
  let next = text

  // "Weitzman 67", "Dizengoff 107,", "Rothschild Blvd 36", Hebrew street + number
  next = next.replace(
    new RegExp(
      `([A-Za-z\\u0590-\\u05FF][A-Za-z\\u0590-\\u05FF'\\u2019.]*)\\s+${HOUSE_NUMBER}(?=\\b)`,
      'g',
    ),
    '$1',
  )

  // "9 Yohanan Hurkanus", "6 Wisotzky Project"
  next = next.replace(new RegExp(`\\b${HOUSE_NUMBER}\\s+(?=[A-Z\\u0590-\\u05FF])`, 'g'), '')

  return tidy(restore(next))
}

export function withoutStreetNumbers(property: Property): Property {
  return {
    ...property,
    title: stripStreetNumber(property.title),
    address: stripStreetNumber(property.address),
  }
}

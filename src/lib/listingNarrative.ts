export interface ListingNarrative {
  intro: string
  highlights: string[]
  specialNotes: string[]
  floor?: string
}

const HEADING =
  /^(property details|property highlights|property features|highlights|features|layout(?:\s*&\s*design)?|apartment details|financial details|the building|the project|description|פרטי(?:\s+ה)?(?:נכס|דירה)|מאפיינים|דגשים|תיאור(?:\s+הנכס)?)\s*:?$/i

const NOISE =
  /asking price|^price\s*:|for further information|for more information|schedule a (?:private )?viewing|tovi\s*\|/i

const CONTACT = /proper\s*tlv|\+?972[\d\s-]{7,}|\d{2,3}-\d{3}-\d{4}|brokerage fee/i

const SPECIAL =
  /tama|pinui[-\s]?binui|urban renewal|building rights|development potential|future potential|future urban|demolition\s*(?:&|and)\s*rebuild|off-market|תמ״א|תמא|פינוי[-\s]?בינוי/i

const FACT_ONLY =
  /^(?:\d+\s*(?:m²|sq\.?\s*m|sqm)|(?:\d+|one|two|three|four|five)[-\s](?:room|rooms|bedroom|bedrooms|bathroom|bathrooms)(?:\s+apartment)?)$/i

function tidy(value: string): string {
  return value.replace(/^[\s•\-–—*]+/, '').replace(/\s+/g, ' ').trim()
}

function isNoise(value: string): boolean {
  if (value.length > 180) return false
  return NOISE.test(value) || CONTACT.test(value) || /^nis\b/i.test(value)
}

function splitSentences(value: string): string[] {
  return value
    .split(/(?<=[.!?])\s+/)
    .map(tidy)
    .filter(Boolean)
}

function isSpecialHeading(value: string): boolean {
  return (
    value.length < 48 &&
    !/[.!?]$/.test(value) &&
    (SPECIAL.test(value) || /future potential|urban renewal|building rights/i.test(value))
  )
}

export function extractFloorLabel(text: string): string | undefined {
  const source = text.replace(/\s+/g, ' ')
  const patterns = [
    /(\d+)(?:st|nd|rd|th)?\s*(?:and\s+top\s+)?floor/i,
    /(?:on the|situated on the|occupying the)\s+(\d+)(?:st|nd|rd|th)?\s+floor/i,
    /floor\s*[:\-]?\s*(\d+)/i,
    /(\d+)(?:st|nd|rd|th)?\s*floor\s+out\s+of/i,
    /top floor\s*\((\d+)/i,
    /קומה\s*(\d+)/i,
  ]

  for (const pattern of patterns) {
    const match = source.match(pattern)
    if (match?.[1]) return match[1]
  }

  if (/ground floor/i.test(source)) return 'G'
  if (/\b(?:high )?first floor\b/i.test(source)) return '1'
  return undefined
}

function collectBullets(block: string): string[] {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^([•\-–—*]\s+|\d+[.)]\s+)/.test(line))
    .map((line) => tidy(line.replace(/^([•\-–—*]+|\d+[.)])\s*/, '')))
    .filter((line) => line.length > 2 && line.length < 160 && !isNoise(line) && !FACT_ONLY.test(line))
}

function collectInlineFacts(compact: string): string[] {
  if (compact.length > 220 || compact.length < 24) return []
  if ((compact.match(/[,;•]/g) || []).length < 2) return []
  if (!/\d+\s*(?:m²|sq\.?\s*m|sqm|rooms?|bedrooms?|bathrooms?|floor)/i.test(compact)) return []
  return compact
    .split(/[,;•]/)
    .map(tidy)
    .filter(
      (item) =>
        item.length > 8 &&
        item.length < 90 &&
        !isNoise(item) &&
        !FACT_ONLY.test(item) &&
        !SPECIAL.test(item),
    )
}

export function splitListingNarrative(description: string): ListingNarrative {
  const raw = description.trim()
  if (!raw) return { intro: '', highlights: [], specialNotes: [] }

  const floor = extractFloorLabel(raw)
  const blocks = raw.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean)

  const highlights: string[] = []
  const specialNotes: string[] = []
  const introParts: string[] = []
  let inHighlights = false
  let specialSection = false

  const pushUnique = (list: string[], value: string) => {
    if (!list.includes(value)) list.push(value)
  }

  for (const block of blocks) {
    const compact = tidy(block.replace(/\n/g, ' '))
    if (!compact || isNoise(compact)) {
      inHighlights = false
      specialSection = false
      continue
    }

    if (HEADING.test(compact)) {
      inHighlights = /highlight|detail|feature|layout|פרטי|מאפיינים|דגשים/i.test(compact)
      specialSection = /future|potential|renewal/i.test(compact)
      continue
    }

    if (isSpecialHeading(compact)) {
      specialSection = true
      inHighlights = false
      continue
    }

    if (SPECIAL.test(compact) || specialSection) {
      const sentences = splitSentences(compact).filter((sentence) => !isNoise(sentence))
      if (introParts.length === 0) {
        const introCandidate = sentences.find((sentence) => !SPECIAL.test(sentence) && sentence.length > 40)
        if (introCandidate) introParts.push(introCandidate)
      }
      const bullets = collectBullets(block)
      const notes = bullets.length
        ? bullets
        : sentences.filter((sentence) => SPECIAL.test(sentence) || specialSection)
      for (const note of notes) {
        if (
          note.length > 24 &&
          note.length < 280 &&
          !note.endsWith(':') &&
          !isSpecialHeading(note)
        ) {
          pushUnique(specialNotes, note)
        }
      }
      if (highlights.length === 0) {
        for (const sentence of sentences) {
          if (
            !SPECIAL.test(sentence) &&
            sentence.length > 36 &&
            sentence.length < 150 &&
            sentence !== introParts[0]
          ) {
            pushUnique(highlights, sentence)
          }
        }
      }
      continue
    }

    const bullets = collectBullets(block)
    if (bullets.length > 0) {
      for (const bullet of bullets) pushUnique(highlights, bullet)
      inHighlights = true
      continue
    }

    const inlineFacts = collectInlineFacts(compact)
    if (inlineFacts.length >= 3) {
      for (const fact of inlineFacts) pushUnique(highlights, fact)
      continue
    }

    if (inHighlights && compact.length < 140 && !SPECIAL.test(compact) && !FACT_ONLY.test(compact)) {
      pushUnique(highlights, compact)
      continue
    }

    if (!SPECIAL.test(compact) && compact.length > 40) {
      introParts.push(compact)
    }
  }

  const preferred = introParts.find((part) => part.length >= 90) ?? introParts[0] ?? ''
  let intro = preferred
  if (intro.length > 280) {
    const meaty = splitSentences(intro).find((sentence) => sentence.length >= 80 && sentence.length <= 280)
    intro = meaty ?? `${intro.slice(0, 280).replace(/\s+\S*$/, '')}…`
  }

  return {
    intro,
    highlights: highlights.slice(0, 8),
    specialNotes: specialNotes.slice(0, 3),
    floor,
  }
}

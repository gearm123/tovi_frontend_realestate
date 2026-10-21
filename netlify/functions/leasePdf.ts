import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PDFDocument, rgb, type PDFPage } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import bidiFactory from 'bidi-js'
import type { LeaseDetails } from '../../src/types/contract'
import { contractHeading, leaseParagraphs } from '../../src/lib/leaseDocument'

const bidi = bidiFactory()

/** Visual order for a right-to-left line. pdf-lib reorders Hebrew itself and reverses numbers, so each character is drawn on its own. */
function visual(text: string): string {
  const levels = bidi.getEmbeddingLevels(text, 'rtl')
  const chars = Array.from(text)
  bidi.getMirroredCharactersMap(text, levels).forEach((ch, index) => {
    chars[index] = ch
  })
  return bidi.getReorderedString(chars.join(''), levels)
}

function loadHebrewFont(): Buffer {
  const candidates = [
    join(process.cwd(), 'netlify/functions/fonts/NotoSansHebrew-Regular.ttf'),
    join(process.cwd(), 'fonts/NotoSansHebrew-Regular.ttf'),
  ]
  for (const path of candidates) {
    try {
      return readFileSync(path)
    } catch {
      /* try the next location */
    }
  }
  throw new Error('Hebrew font missing')
}

function flatten(paragraphs: string[]): string[] {
  return paragraphs.flatMap((paragraph) => paragraph.split('\n'))
}

export async function buildSignedLeasePdf(
  details: LeaseDetails,
  signaturePng: Uint8Array,
  signerName: string,
  signedAt: Date,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)
  const font = await pdf.embedFont(loadHebrewFont())
  const signature = await pdf.embedPng(signaturePng)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 48
  const maxWidth = pageWidth - margin * 2
  const bodySize = 11
  const lineGap = 16
  let page = pdf.addPage([pageWidth, pageHeight])
  let y = pageHeight - margin

  const glyphWidths = (text: string, size: number) =>
    Array.from(visual(text)).map((ch) => font.widthOfTextAtSize(ch, size))

  const paint = (target: PDFPage, logical: string, top: number, size: number, align: 'left' | 'right') => {
    const glyphs = Array.from(visual(logical))
    const widths = glyphs.map((ch) => font.widthOfTextAtSize(ch, size))
    const width = widths.reduce((sum, item) => sum + item, 0)
    let x = align === 'right' ? pageWidth - margin - width : margin
    glyphs.forEach((ch, index) => {
      target.drawText(ch, { x, y: top, size, font, color: rgb(0, 0, 0) })
      x += widths[index] ?? 0
    })
  }

  const drawLine = (logical: string, size = bodySize) => {
    const shown = logical.trim()
    if (y < margin + 36) {
      page = pdf.addPage([pageWidth, pageHeight])
      y = pageHeight - margin
    }
    if (shown) paint(page, shown, y, size, 'right')
    y -= size >= 16 ? 28 : lineGap
  }

  const wrap = (logical: string, size = bodySize) => {
    const words = logical.split(/\s+/).filter(Boolean)
    if (!words.length) {
      drawLine('')
      return
    }
    let current = ''
    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      const width = glyphWidths(next, size).reduce((sum, item) => sum + item, 0)
      if (width <= maxWidth) {
        current = next
      } else {
        if (current) drawLine(current, size)
        current = word
      }
    }
    if (current) drawLine(current, size)
  }

  for (const paragraph of flatten(leaseParagraphs(details))) {
    if (!paragraph.trim()) {
      y -= 8
      continue
    }
    const size = paragraph.startsWith('הסכם שכירות') ? 16 : bodySize
    wrap(paragraph, size)
  }

  y -= 8
  const signedOn = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
    .format(signedAt)
    .replaceAll('/', '.')
  wrap(`נחתם על ידי ${signerName} ביום ${signedOn}`)
  const sigWidth = 180
  const sigHeight = (signature.height / signature.width) * sigWidth
  if (y < margin + sigHeight + 24) {
    page = pdf.addPage([pageWidth, pageHeight])
    y = pageHeight - margin
  }
  page.drawImage(signature, {
    x: pageWidth - margin - sigWidth,
    y: y - sigHeight,
    width: sigWidth,
    height: sigHeight,
  })
  y -= sigHeight + 8
  wrap('חתימת השוכר')

  const footer = `חוזה שכירות – ${contractHeading(details).replace('דירת מגורים – ', '')}`
  const pages = pdf.getPages()
  pages.forEach((item, index) => {
    const label = `עמוד ${index + 1} מתוך ${pages.length}`
    paint(item, footer, 28, 8, 'right')
    paint(item, label, 28, 8, 'left')
  })

  return pdf.save()
}

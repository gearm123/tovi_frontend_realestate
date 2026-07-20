import { getBusiness } from '../lib/siteDataStore'
import { buildWhatsAppUrl } from '../utils/whatsapp'

export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  interest: string
  message: string
  propertyId?: string
  propertyTitle?: string
  agentId?: string
  agentName?: string
  agentEmail?: string
}

export function buildContactInquiryText(inquiry: ContactInquiry): string {
  const lines = [
    `New inquiry from ${inquiry.name}`,
    `Email: ${inquiry.email}`,
  ]

  if (inquiry.phone) lines.push(`Phone: ${inquiry.phone}`)
  lines.push(`Interest: ${inquiry.interest}`)

  if (inquiry.propertyTitle) {
    const idSuffix = inquiry.propertyId ? ` (${inquiry.propertyId})` : ''
    lines.push(`Property: ${inquiry.propertyTitle}${idSuffix}`)
  }

  if (inquiry.agentName) lines.push(`Assigned agent: ${inquiry.agentName}`)

  lines.push('', inquiry.message)
  return lines.join('\n')
}

export function getContactRecipientEmail(inquiry: Pick<ContactInquiry, 'agentEmail'>): string {
  return inquiry.agentEmail?.trim() || getBusiness().email
}

export function buildContactMailtoUrl(inquiry: ContactInquiry): string {
  const to = getContactRecipientEmail(inquiry)
  const subject = inquiry.propertyTitle
    ? `ProperTLV inquiry: ${inquiry.propertyTitle}`
    : `ProperTLV inquiry: ${inquiry.interest}`
  const body = buildContactInquiryText(inquiry)

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildContactWhatsAppUrl(inquiry: ContactInquiry): string {
  return buildWhatsAppUrl(getBusiness().phone.whatsapp, buildContactInquiryText(inquiry))
}

export async function submitNetlifyForm(
  formName: string,
  data: Record<string, string>,
): Promise<boolean> {
  const params = new URLSearchParams({ 'form-name': formName, ...data })

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function submitContactInquiry(form: HTMLFormElement): Promise<boolean> {
  const formData = new FormData(form)
  const data: Record<string, string> = {}

  formData.forEach((value, key) => {
    if (key === 'form-name' || typeof value !== 'string') return
    data[key] = value
  })

  return submitNetlifyForm('contact', data)
}

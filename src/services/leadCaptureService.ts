import { toAbsoluteUrl } from '../constants/seoConfig'
import { getBusiness } from '../lib/siteDataStore'
import { buildWhatsAppUrl } from '../utils/whatsapp'
import { submitNetlifyForm } from './contactService'
import { saveFailedLead } from './listingsApi'

export interface LeadCapturePayload {
  name: string
  phone: string
  message?: string
  sourcePage: string
  interest: string
  recipientEmail: string
}

export function buildLeadCaptureMessage(payload: LeadCapturePayload): string {
  const lines = [
    `New lead from ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Interest: ${payload.interest}`,
    `Page: ${toAbsoluteUrl(payload.sourcePage)}`,
  ]

  if (payload.message?.trim()) {
    lines.push('', payload.message.trim())
  }

  return lines.join('\n')
}

export function buildLeadCaptureWhatsAppUrl(payload: LeadCapturePayload): string {
  return buildWhatsAppUrl(getBusiness().phone.whatsapp, buildLeadCaptureMessage(payload))
}

export function getLeadCapturePayloadFromForm(form: HTMLFormElement): LeadCapturePayload {
  const formData = new FormData(form)

  return {
    name: String(formData.get('name') ?? '').trim(),
    phone: String(formData.get('phone') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim() || undefined,
    sourcePage: String(formData.get('sourcePage') ?? '').trim(),
    interest: String(formData.get('interest') ?? '').trim(),
    recipientEmail: String(formData.get('recipientEmail') ?? '').trim(),
  }
}

export async function submitLeadCapture(form: HTMLFormElement): Promise<boolean> {
  const formData = new FormData(form)
  if (String(formData.get('bot-field') ?? '').trim()) return true
  const payload = getLeadCapturePayloadFromForm(form)
  const data: Record<string, string> = {
    subject: `New ProperTLV lead: ${payload.name}`,
  }

  formData.forEach((value, key) => {
    if (key === 'form-name' || key === 'subject' || typeof value !== 'string') return
    data[key] = value
  })

  const ok = await submitNetlifyForm('lead-capture', data)

  if (!ok) {
    try {
      await saveFailedLead(payload)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Could not store the failed lead')
    }
    if (import.meta.env.DEV) {
      console.info('[Lead capture] Netlify form unavailable in dev — payload:', data)
      return true
    }
  }

  return ok
}

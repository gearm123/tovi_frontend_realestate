import { getBusiness, getLeadCaptureSettings } from '../lib/siteDataStore'
import { submitNetlifyForm } from './contactService'
import { buildWhatsAppUrl } from '../utils/whatsapp'

export interface LeadCapturePayload {
  name: string
  phone: string
  message?: string
  sourcePage: string
  interest: string
}

export function buildLeadCaptureMessage(payload: LeadCapturePayload): string {
  const lines = [
    `New lead from ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Interest: ${payload.interest}`,
    `Page: ${payload.sourcePage}`,
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
  }
}

export async function submitLeadCapture(form: HTMLFormElement): Promise<boolean> {
  const formData = new FormData(form)
  const data: Record<string, string> = {
    recipientEmail: getLeadCaptureSettings().recipientEmail,
  }

  formData.forEach((value, key) => {
    if (key === 'form-name' || typeof value !== 'string') return
    data[key] = value
  })

  const ok = await submitNetlifyForm('lead-capture', data)

  if (!ok && import.meta.env.DEV) {
    console.info('[Lead capture] Netlify form unavailable in dev — payload:', data)
    return true
  }

  return ok
}

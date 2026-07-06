/**
 * Newsletter signup — Netlify Forms by default (emails office on deploy host).
 * Swap NEWSLETTER_PROVIDER for Mailchimp, Brevo, CRM, or a custom API later.
 */

import { submitNetlifyForm } from './contactService'

export interface NewsletterSignupPayload {
  name?: string
  email: string
}

export type NewsletterProvider = 'netlify' | 'placeholder' | 'mailchimp' | 'brevo' | 'crm' | 'api'

const NEWSLETTER_PROVIDER: NewsletterProvider = 'netlify'

export function getNewsletterProvider(): NewsletterProvider {
  return NEWSLETTER_PROVIDER
}

export async function subscribeToNewsletter(
  payload: NewsletterSignupPayload,
): Promise<void> {
  switch (NEWSLETTER_PROVIDER) {
    case 'netlify': {
      const ok = await submitNetlifyForm('newsletter', {
        name: payload.name?.trim() ?? '',
        email: payload.email.trim(),
      })
      if (!ok) {
        if (import.meta.env.DEV) {
          console.info('[Newsletter] Netlify form unavailable in dev — signup:', payload)
          return
        }
        throw new Error('Newsletter signup failed')
      }
      return
    }
    case 'placeholder':
      await new Promise((resolve) => setTimeout(resolve, 350))
      if (import.meta.env.DEV) {
        console.info('[Newsletter] Placeholder signup:', payload)
      }
      return
    case 'mailchimp':
    case 'brevo':
    case 'crm':
    case 'api':
      throw new Error(`Newsletter provider "${NEWSLETTER_PROVIDER}" is not configured yet`)
    default:
      throw new Error('Unknown newsletter provider')
  }
}

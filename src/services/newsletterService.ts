/**
 * Newsletter signup — placeholder until Mailchimp, Brevo, CRM, or backend is connected.
 * Swap NEWSLETTER_PROVIDER and implement the matching branch in subscribeToNewsletter.
 */

export interface NewsletterSignupPayload {
  name?: string
  email: string
}

export type NewsletterProvider = 'placeholder' | 'mailchimp' | 'brevo' | 'crm' | 'api'

const NEWSLETTER_PROVIDER: NewsletterProvider = 'placeholder'

export function getNewsletterProvider(): NewsletterProvider {
  return NEWSLETTER_PROVIDER
}

export async function subscribeToNewsletter(
  payload: NewsletterSignupPayload,
): Promise<void> {
  switch (NEWSLETTER_PROVIDER) {
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

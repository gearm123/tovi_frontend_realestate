import { useState, type FormEvent } from 'react'
import type { NewsletterSection } from '../../types/content'
import { subscribeToNewsletter } from '../../services/newsletterService'
import './NewsletterSignupSection.css'

interface NewsletterSignupSectionProps {
  content: NewsletterSection
  compact?: boolean
}

export default function NewsletterSignupSection({
  content,
  compact = false,
}: NewsletterSignupSectionProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await subscribeToNewsletter({ name: name.trim() || undefined, email: email.trim() })
      setStatus('success')
      setName('')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const className = [
    'newsletter-signup',
    compact ? 'newsletter-signup--compact' : '',
    status === 'success' ? 'newsletter-signup--success' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={className} aria-labelledby="newsletter-signup-title">
      <div className="newsletter-signup__inner">
        {content.accent && (
          <p className="newsletter-signup__accent">{content.accent}</p>
        )}
        <h2 id="newsletter-signup-title" className="newsletter-signup__title">
          {content.title}
        </h2>
        <p className="newsletter-signup__description">{content.description}</p>

        {status === 'success' ? (
          <p className="newsletter-signup__message" role="status">
            {content.successMessage}
          </p>
        ) : (
          <form
            className="newsletter-signup__form"
            name="newsletter"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            noValidate
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <p className="newsletter-signup__honeypot" hidden>
              <label>
                Do not fill this out:
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <label className="newsletter-signup__field">
              <span className="newsletter-signup__label">{content.nameLabel}</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={status === 'loading'}
              />
            </label>

            <label className="newsletter-signup__field">
              <span className="newsletter-signup__label">{content.emailLabel}</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={status === 'loading'}
              />
            </label>

            <button
              type="submit"
              className="newsletter-signup__submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '…' : content.buttonLabel}
            </button>

            {status === 'error' && (
              <p className="newsletter-signup__error" role="alert">
                {content.errorMessage}
              </p>
            )}
          </form>
        )}

        {content.footnote && status !== 'success' && (
          <p className="newsletter-signup__footnote">{content.footnote}</p>
        )}
      </div>
    </section>
  )
}

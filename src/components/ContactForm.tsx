import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getBusiness } from '../lib/siteDataStore'
import { getAgentById } from '../services/agentService'
import {
  buildContactMailtoUrl,
  buildContactWhatsAppUrl,
  submitContactInquiry,
  type ContactInquiry,
} from '../services/contactService'
import { getPropertyById } from '../services/propertyService'
import { getLocalizedProperty } from '../i18n/propertyTranslations'
import './ContactForm.css'

export type ContactInterest = 'selling' | 'buying' | 'renting' | 'general'

const interestKeys: { value: ContactInterest; key: 'selling' | 'buying' | 'renting' | 'general' }[] = [
  { value: 'selling', key: 'selling' },
  { value: 'buying', key: 'buying' },
  { value: 'renting', key: 'renting' },
  { value: 'general', key: 'general' },
]

function parseInterest(value: string | null): ContactInterest | null {
  if (value === 'selling' || value === 'buying' || value === 'renting' || value === 'general') {
    return value
  }
  return null
}

interface ContactSuccessLinks {
  whatsappUrl: string
  mailtoUrl: string
  recipientEmail: string
}

export default function ContactForm() {
  const { t, locale } = useLanguage()
  const [searchParams] = useSearchParams()
  const [interest, setInterest] = useState<ContactInterest>('general')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successLinks, setSuccessLinks] = useState<ContactSuccessLinks | null>(null)

  const propertyId = searchParams.get('property')
  const agentId = searchParams.get('agent')
  const property = propertyId ? getPropertyById(propertyId) : undefined
  const agent = agentId ? getAgentById(agentId, locale) : undefined

  const propertyTitle = useMemo(() => {
    if (!property) return ''

    const localized = getLocalizedProperty(property.id, locale, {
      title: property.title,
      address: property.address,
      description: property.description,
      price: property.price,
      neighborhood: property.neighborhood,
    })
    return localized.title
  }, [property, locale])

  useEffect(() => {
    const fromUrl = parseInterest(searchParams.get('interest'))
    if (fromUrl) setInterest(fromUrl)
  }, [searchParams])

  useEffect(() => {
    if (!property || !propertyTitle) return

    setMessage(
      t.contactForm.propertyMessageTemplate
        .replace('{title}', propertyTitle)
        .replace('{id}', property.id),
    )
  }, [property, propertyTitle, t.contactForm.propertyMessageTemplate])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const interestLabel = t.contactForm[interest]

    const inquiry: ContactInquiry = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim() || undefined,
      interest: interestLabel,
      message: String(formData.get('message') ?? '').trim(),
      propertyId: property?.id,
      propertyTitle: propertyTitle || undefined,
      agentId: agent?.id,
      agentName: agent?.name,
      agentEmail: agent?.email,
    }

    const whatsappUrl = buildContactWhatsAppUrl(inquiry)
    const mailtoUrl = buildContactMailtoUrl(inquiry)

    await submitContactInquiry(form)

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    setSuccessLinks({
      whatsappUrl,
      mailtoUrl,
      recipientEmail: agent?.email ?? getBusiness().email,
    })
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted && successLinks) {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p className="contact-form__success-title">{t.contactForm.success}</p>
        <p className="contact-form__success-hint">{t.contactForm.successHint}</p>
        <div className="contact-form__success-actions">
          <a
            href={successLinks.whatsappUrl}
            className="contact-form__action contact-form__action--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.contactForm.whatsappAction}
          </a>
          <a href={successLinks.mailtoUrl} className="contact-form__action contact-form__action--email">
            {t.contactForm.emailAction.replace('{email}', successLinks.recipientEmail)}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form
      className="contact-form"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="contact-form__honeypot" hidden>
        <label>
          Do not fill this out:
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {property && (
        <div className="contact-form__context" role="status">
          <p className="contact-form__context-title">
            {t.contactForm.propertyContext.replace('{title}', propertyTitle)}
          </p>
          {agent && (
            <p className="contact-form__context-agent">
              {t.contactForm.routedTo
                .replace('{name}', agent.name)
                .replace('{email}', agent.email)}
            </p>
          )}
        </div>
      )}

      {property && <input type="hidden" name="propertyId" value={property.id} />}
      {agent && (
        <>
          <input type="hidden" name="agentId" value={agent.id} />
          <input type="hidden" name="agentEmail" value={agent.email} />
        </>
      )}
      <input type="hidden" name="interest" value={interest} />

      <fieldset className="contact-form__interests">
        <legend className="contact-form__legend">{t.contactForm.legend}</legend>
        <div className="contact-form__interest-grid">
          {interestKeys.map((option) => (
            <label key={option.value} className="contact-form__interest">
              <input
                type="radio"
                name="interestChoice"
                value={option.value}
                checked={interest === option.value}
                onChange={() => setInterest(option.value)}
              />
              <span>{t.contactForm[option.key]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-form__fields">
        <label className="contact-form__field">
          <span>{t.contactForm.name}</span>
          <input type="text" name="name" required autoComplete="name" disabled={submitting} />
        </label>

        <label className="contact-form__field">
          <span>{t.contactForm.email}</span>
          <input type="email" name="email" required autoComplete="email" disabled={submitting} />
        </label>

        <label className="contact-form__field">
          <span>{t.contactForm.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" disabled={submitting} />
        </label>

        <label className="contact-form__field contact-form__field--full">
          <span>{t.contactForm.message}</span>
          <textarea
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={submitting}
          />
        </label>
      </div>

      <button type="submit" className="contact-form__submit site-cta site-cta--solid" disabled={submitting}>
        {submitting ? t.contactForm.submitting : t.contactForm.submit}
      </button>
    </form>
  )
}

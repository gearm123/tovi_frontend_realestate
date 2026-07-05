import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getAgentById } from '../services/agentService'
import { getPropertyById } from '../services/propertyService'
import { getLocalizedProperty } from '../i18n/propertyTranslations'
import './ContactForm.css'

export type ContactInterest =
  | 'selling'
  | 'buying'
  | 'renting'
  | 'general'

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

export default function ContactForm() {
  const { t, locale } = useLanguage()
  const [searchParams] = useSearchParams()
  const [interest, setInterest] = useState<ContactInterest>('general')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p>{t.contactForm.success}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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

      <fieldset className="contact-form__interests">
        <legend className="contact-form__legend">{t.contactForm.legend}</legend>
        <div className="contact-form__interest-grid">
          {interestKeys.map((option) => (
            <label key={option.value} className="contact-form__interest">
              <input
                type="radio"
                name="interest"
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
          <input type="text" name="name" required autoComplete="name" />
        </label>

        <label className="contact-form__field">
          <span>{t.contactForm.email}</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>

        <label className="contact-form__field">
          <span>{t.contactForm.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>

        <label className="contact-form__field contact-form__field--full">
          <span>{t.contactForm.message}</span>
          <textarea
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="contact-form__submit">
        {t.contactForm.submit}
      </button>
    </form>
  )
}

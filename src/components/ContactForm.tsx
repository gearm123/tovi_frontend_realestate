import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
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
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [interest, setInterest] = useState<ContactInterest>('general')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fromUrl = parseInterest(searchParams.get('interest'))
    if (fromUrl) setInterest(fromUrl)
  }, [searchParams])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {    e.preventDefault()
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
          <textarea name="message" rows={5} required />
        </label>
      </div>

      <button type="submit" className="contact-form__submit">
        {t.contactForm.submit}
      </button>
    </form>
  )
}

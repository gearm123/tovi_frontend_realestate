import { useState, type FormEvent } from 'react'
import './ContactForm.css'

export type ContactInterest =
  | 'selling'
  | 'buying'
  | 'renting'
  | 'general'

const interestOptions: { value: ContactInterest; label: string }[] = [
  { value: 'selling', label: 'Selling a property' },
  { value: 'buying', label: 'Buying a property' },
  { value: 'renting', label: 'Renting a property' },
  { value: 'general', label: 'General inquiry' },
]

export default function ContactForm() {
  const [interest, setInterest] = useState<ContactInterest>('general')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p>Thank you for reaching out. We will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <fieldset className="contact-form__interests">
        <legend className="contact-form__legend">I am interested in</legend>
        <div className="contact-form__interest-grid">
          {interestOptions.map((option) => (
            <label key={option.value} className="contact-form__interest">
              <input
                type="radio"
                name="interest"
                value={option.value}
                checked={interest === option.value}
                onChange={() => setInterest(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-form__fields">
        <label className="contact-form__field">
          <span>Name</span>
          <input type="text" name="name" required autoComplete="name" />
        </label>

        <label className="contact-form__field">
          <span>Email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>

        <label className="contact-form__field">
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>

        <label className="contact-form__field contact-form__field--full">
          <span>Message</span>
          <textarea name="message" rows={5} required />
        </label>
      </div>

      <button type="submit" className="contact-form__submit">
        Send message
      </button>
    </form>
  )
}

import ContactForm from '../components/ContactForm'
import PageShell from '../components/PageShell'

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Us"
      subtitle="Tell us what you are looking for and we will get back to you."
    >
      <p>
        Reach us at{' '}
        <a href="mailto:hello@propertlv.com">hello@propertlv.com</a> or{' '}
        <a href="tel:+97235551234">+972 3 555 1234</a>. Rothschild Blvd 45,
        Tel Aviv.
      </p>
      <ContactForm />
    </PageShell>
  )
}

import ContactForm from '../components/ContactForm'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <PageShell title={t.contact.title} subtitle={t.contact.subtitle}>
      <p>
        {t.contact.reachUs}{' '}
        <a href="mailto:hello@propertlv.com">hello@propertlv.com</a> {t.contact.or}{' '}
        <a href="tel:+97235551234">+972 3 555 1234</a>. {t.contact.address}
      </p>
      <ContactForm />
    </PageShell>
  )
}

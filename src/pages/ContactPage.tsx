import ContactForm from '../components/ContactForm'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../hooks/useSiteContent'

export default function ContactPage() {
  const { t } = useLanguage()
  const { business } = useSiteContent()

  return (
    <PageShell title={t.contact.title} accent={t.contact.accent} subtitle={t.contact.subtitle}>
      <p>
        {t.contact.reachUs}{' '}
        <a href={`mailto:${business.email}`}>{business.email}</a> {t.contact.or}{' '}
        <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>.{' '}
        {business.address.display}
      </p>
      <ContactForm />
    </PageShell>
  )
}

import ContactForm from '../components/ContactForm'
import ConversionSections from '../components/conversion/ConversionSections'
import PageShell from '../components/PageShell'
import { CONTACT_PLACEHOLDERS } from '../data/placeholders'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../hooks/useSiteContent'
import './ContactPage.css'

export default function ContactPage() {
  const { t } = useLanguage()
  const { business } = useSiteContent()

  return (
    <PageShell title={t.contact.title} accent={t.contact.accent} subtitle={t.contact.subtitle} seoKey="contact">
      <p>
        {t.contact.reachUs}{' '}
        {CONTACT_PLACEHOLDERS.email ? (
          <span>{business.email}</span>
        ) : (
          <a href={`mailto:${business.email}`}>{business.email}</a>
        )}{' '}
        {CONTACT_PLACEHOLDERS.email && (
          <span className="contact-page__placeholder-tag">({t.footer.placeholder})</span>
        )}{' '}
        {t.contact.or}{' '}
        <a href={`tel:${business.phone.tel}`}>{business.phone.display}</a>.{' '}
        {business.address.display}
        {CONTACT_PLACEHOLDERS.address && (
          <span className="contact-page__placeholder-tag"> ({t.footer.placeholder})</span>
        )}
      </p>
      <ContactForm />
      <ConversionSections variant="stacked" compact />
    </PageShell>
  )
}

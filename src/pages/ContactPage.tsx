import ContactForm from '../components/ContactForm'
import ConversionSections from '../components/conversion/ConversionSections'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import './ContactPage.css'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <PageShell title={t.contact.title} seoKey="contact">
      <ContactForm />
      <ConversionSections variant="stacked" compact showBooking={false} />
    </PageShell>
  )
}

import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <PageShell title={t.about.title} subtitle={t.about.subtitle}>
      <p>{t.about.p1}</p>
      <p>{t.about.p2}</p>
      <p>{t.about.p3}</p>
    </PageShell>
  )
}

import { Link, useParams } from 'react-router-dom'
import PageSeo from '../components/seo/PageSeo'
import PageShell from '../components/PageShell'
import { useLanguage } from '../context/LanguageContext'
import './GuidesPage.css'

const GUIDES = [
  {
    slug: 'moving-to-israel',
    file: '/guides/moving-to-israel.pdf',
    key: 'moving',
  },
  {
    slug: 'investing-in-israel',
    file: '/guides/investing-in-israel.pdf',
    key: 'investing',
  },
] as const

export default function GuidesPage() {
  const { slug } = useParams()
  const { t } = useLanguage()
  const guide = slug ? GUIDES.find((item) => item.slug === slug) : undefined

  if (slug && !guide) {
    return (
      <>
        <PageSeo title={t.guides.notFound} description={t.guides.back} path="/guides" noIndex />
        <div className="guides-page guides-page--missing">
          <h1>{t.guides.notFound}</h1>
          <Link to="/guides">{t.guides.back}</Link>
        </div>
      </>
    )
  }

  if (guide) {
    const copy = t.guides[guide.key]
    return (
      <PageShell title={copy.title} subtitle={copy.summary}>
        <PageSeo
          title={`${copy.title} | ProperTLV`}
          description={copy.summary}
          path={`/guides/${guide.slug}`}
        />
        <div className="guides-page__viewer">
          <div className="guides-page__actions">
            <Link className="site-cta" to="/guides">
              {t.guides.back}
            </Link>
            <a className="site-cta site-cta--solid" href={guide.file} download>
              {t.guides.download}
            </a>
          </div>
          <iframe className="guides-page__frame" src={guide.file} title={copy.title} />
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title={t.guides.title} subtitle={t.guides.subtitle} seoKey="guides">
      <ul className="guides-page__list">
        {GUIDES.map((item) => {
          const copy = t.guides[item.key]
          return (
            <li key={item.slug} className="guides-page__card">
              <h2 className="guides-page__card-title">{copy.title}</h2>
              <p className="guides-page__card-summary">{copy.summary}</p>
              <div className="guides-page__actions">
                <Link className="site-cta site-cta--solid" to={`/guides/${item.slug}`}>
                  {t.guides.open}
                </Link>
                <a className="site-cta" href={item.file} download>
                  {t.guides.download}
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </PageShell>
  )
}

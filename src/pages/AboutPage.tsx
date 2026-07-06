import PageShell from '../components/PageShell'
import { useSiteContent } from '../hooks/useSiteContent'
import './AboutPage.css'

export default function AboutPage() {

  const { content } = useSiteContent()

  const { about } = content



  return (

    <PageShell title={about.title} accent={about.accent} subtitle={about.subtitle} seoKey="about">

      {about.paragraphs.map((paragraph) => (

        <p key={paragraph.slice(0, 48)}>{paragraph}</p>

      ))}

      <ul className="about-page__highlights">

        {about.highlights.map((item) => (

          <li key={item}>{item}</li>

        ))}

      </ul>

    </PageShell>

  )

}


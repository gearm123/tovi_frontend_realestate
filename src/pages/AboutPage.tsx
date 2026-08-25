import PageShell from '../components/PageShell'
import TeamSection from '../components/services/TeamSection'
import { useSiteContent } from '../hooks/useSiteContent'
import './AboutPage.css'

export default function AboutPage() {
  const { content } = useSiteContent()
  const { about, salesTeam } = content

  return (
    <div className="about-page">
      <PageShell title={about.title} subtitle={about.subtitle} seoKey="about">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}

        <ul className="about-page__highlights">
          {about.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageShell>

      <div className="about-page__team">
        <TeamSection id="about-team" section={salesTeam} variant="premium" />
      </div>
    </div>
  )
}

import type { TeamSectionContent } from '../../types/content'
import './TeamSection.css'

interface TeamSectionProps {
  section: TeamSectionContent
  id?: string
  variant?: 'default' | 'premium'
}

export default function TeamSection({
  section,
  id,
  variant = 'default',
}: TeamSectionProps) {
  return (
    <section
      id={id}
      className={`team-section team-section--${variant}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className="team-section__header">
        {section.accent && (
          <p className="team-section__accent orange-cursive-title orange-cursive-title--subtitle">
            {section.accent}
          </p>
        )}
        <h2 className="team-section__title" id={id ? `${id}-title` : undefined}>
          {section.title}
        </h2>
        {section.subtitle && <p className="team-section__subtitle">{section.subtitle}</p>}
      </header>

      <div className="team-section__grid">
        {section.members.map((member) => (
          <article key={member.id} className="team-section__card">
            <div className="team-section__photo-wrap">
              <img
                className="team-section__photo"
                src={member.image}
                alt={member.imageAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="team-section__copy">
              <h3 className="team-section__name">{member.name}</h3>
              <p className="team-section__role">{member.title}</p>
              <p className="team-section__bio">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>

      {section.footnote && <p className="team-section__footnote">{section.footnote}</p>}
    </section>
  )
}

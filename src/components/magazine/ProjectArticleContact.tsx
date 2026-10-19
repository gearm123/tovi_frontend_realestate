import { Link } from 'react-router-dom'
import type { Locale } from '../../i18n/types'
import './ProjectArticleContact.css'

const COPY: Record<Locale, { text: string; action: string }> = {
  en: {
    text: 'We are in contact with all the projects and can help you choose.',
    action: 'Contact ProperTLV',
  },
  he: {
    text: 'אנחנו בקשר עם כל הפרויקטים ויכולים לעזור לכם לבחור.',
    action: 'צרו קשר עם ProperTLV',
  },
  fr: {
    text: 'Nous sommes en contact avec tous les projets et pouvons vous aider à choisir.',
    action: 'Contacter ProperTLV',
  },
  ru: {
    text: 'Мы на связи со всеми проектами и можем помочь вам с выбором.',
    action: 'Связаться с ProperTLV',
  },
}

export default function ProjectArticleContact({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  return (
    <aside className="project-article-contact">
      <p className="project-article-contact__text">{copy.text}</p>
      <Link to="/contact" className="project-article-contact__action site-cta">
        {copy.action}
      </Link>
    </aside>
  )
}

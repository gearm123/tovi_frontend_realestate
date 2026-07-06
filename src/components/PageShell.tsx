import type { ReactNode } from 'react'
import PageSeo from './seo/PageSeo'
import type { StaticSeoPageKey } from '../seo/pageSeoCatalog'
import './PageShell.css'

interface PageShellProps {
  title: string
  accent?: string
  subtitle?: string
  seoKey?: StaticSeoPageKey
  children?: ReactNode
}

export default function PageShell({
  title,
  accent,
  subtitle,
  seoKey,
  children,
}: PageShellProps) {
  return (
    <>
      {seoKey && <PageSeo pageKey={seoKey} />}
      <div className="page-shell">
      <header className="page-shell__header">
        {accent && (
          <p className="page-shell__accent orange-cursive-title orange-cursive-title--subtitle">
            {accent}
          </p>
        )}
        <h1 className="page-shell__title">{title}</h1>
        {subtitle && <p className="page-shell__subtitle">{subtitle}</p>}
      </header>
      {children && <div className="page-shell__content">{children}</div>}
      </div>
    </>
  )
}

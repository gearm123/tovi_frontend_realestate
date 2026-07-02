import type { ReactNode } from 'react'
import './PageShell.css'

interface PageShellProps {
  title: string
  accent?: string
  subtitle?: string
  children?: ReactNode
}

export default function PageShell({
  title,
  accent,
  subtitle,
  children,
}: PageShellProps) {
  return (
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
  )
}

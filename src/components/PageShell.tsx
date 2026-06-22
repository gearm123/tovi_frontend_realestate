import type { ReactNode } from 'react'
import './PageShell.css'

interface PageShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="page-shell">
      <header className="page-shell__header">
        <h1 className="page-shell__title">{title}</h1>
        {subtitle && <p className="page-shell__subtitle">{subtitle}</p>}
      </header>
      <div className="page-shell__content">{children}</div>
    </div>
  )
}

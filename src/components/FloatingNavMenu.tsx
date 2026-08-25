import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { isNavItemActive, siteNavItems } from '../data/siteNav'
import { useLanguage } from '../context/LanguageContext'
import { scrollPageToTop } from '../utils/scrollPageToTop'
import './FloatingNavMenu.css'

export default function FloatingNavMenu() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="floating-nav-menu">
      <button
        ref={triggerRef}
        type="button"
        className={['floating-nav-menu__trigger', open ? 'floating-nav-menu__trigger--open' : '']
          .filter(Boolean)
          .join(' ')}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t.floatingNav.closeMenu : t.floatingNav.openMenu}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="floating-nav-menu__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="floating-nav-menu__backdrop"
            aria-label={t.floatingNav.closeMenu}
            onClick={closeMenu}
          />
          <nav
            id={panelId}
            className="floating-nav-menu__panel"
            aria-label={t.header.navAria}
          >
            {siteNavItems.map((item) => (
              <span key={item.to} className="floating-nav-menu__item">
                <NavLink
                  to={item.to}
                  className={() => (isNavItemActive(item, pathname) ? 'active' : undefined)}
                  onClick={() => {
                    closeMenu()
                    scrollPageToTop()
                  }}
                >
                  {t.header.nav[item.key]}
                </NavLink>
              </span>
            ))}
          </nav>
        </>
      )}
    </div>
  )
}

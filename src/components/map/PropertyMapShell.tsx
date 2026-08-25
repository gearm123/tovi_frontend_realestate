import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useViewport } from '../../hooks/useViewport'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import PropertyMapList from './PropertyMapList'

export interface PropertyMapCanvasContext {
  pins: PropertyMapPin[]
  activePinId: string | null
  onPinSelect: (id: string | null) => void
  expanded: boolean
  neighborhoodLabel: (key: string) => string
  listingLabel: (pin: PropertyMapPin) => string
}

interface PropertyMapShellProps {
  pins: PropertyMapPin[]
  content: MapSectionContent
  expandable?: boolean
  expanded?: boolean
  onExpand?: () => void
  onCollapse?: () => void
  filterControls?: ReactNode
  canvasNote?: ReactNode
  variant?: 'section' | 'page'
  children: (ctx: PropertyMapCanvasContext) => ReactNode
}

export default function PropertyMapShell({
  pins,
  content,
  expandable = false,
  expanded = false,
  onExpand,
  onCollapse,
  filterControls,
  canvasNote,
  variant = 'section',
  children,
}: PropertyMapShellProps) {
  const { t } = useLanguage()
  const viewport = useViewport()
  const closeRef = useRef<HTMLButtonElement>(null)
  const [activePinId, setActivePinId] = useState<string | null>(null)

  const neighborhoodLabel = (key: string) =>
    (t.neighborhoods as Record<string, string>)[key] ?? key

  const listingLabel = (pin: PropertyMapPin) =>
    pin.listingType === 'sale' ? content.saleLabel : content.rentalLabel

  useEffect(() => {
    if (activePinId && !pins.some((pin) => pin.id === activePinId)) {
      setActivePinId(null)
    }
  }, [activePinId, pins])

  useEffect(() => {
    if (!expanded) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCollapse?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded, onCollapse])

  const canvasCtx: PropertyMapCanvasContext = {
    pins,
    activePinId,
    onPinSelect: setActivePinId,
    expanded,
    neighborhoodLabel,
    listingLabel,
  }

  const filters =
    expanded && viewport === 'mobile' && filterControls ? (
      <details className="property-map-shell__filters-panel">
        <summary>{t.search.filterTitle}</summary>
        {filterControls}
      </details>
    ) : (
      filterControls
    )

  return (
    <div
      className={[
        'property-map-shell',
        'placeholder-map',
        variant === 'page' ? 'property-map-shell--page' : '',
        expanded ? 'property-map-shell--expanded' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role={expanded ? 'dialog' : undefined}
      aria-modal={expanded ? true : undefined}
      aria-labelledby={expanded ? 'property-map-explorer-title' : undefined}
    >
      {expanded ? (
        <div className="property-map-shell__top">
          <h2 id="property-map-explorer-title" className="property-map-shell__title">
            {content.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="property-map-shell__control site-cta"
            onClick={onCollapse}
            aria-label={t.map.collapseAria}
          >
            {t.map.collapse}
          </button>
        </div>
      ) : null}

      {filters}

      <div className="placeholder-map__layout">
        <div className="placeholder-map__canvas-wrap">
          {!expanded && expandable ? (
            <button
              type="button"
              className="property-map-shell__expand site-cta"
              onClick={onExpand}
              aria-label={t.map.expandAria}
            >
              {t.map.expand}
            </button>
          ) : null}
          {children(canvasCtx)}
          {canvasNote}
        </div>
        <PropertyMapList
          pins={pins}
          activePinId={activePinId}
          onPinSelect={setActivePinId}
          content={content}
          neighborhoodLabel={neighborhoodLabel}
          listingLabel={listingLabel}
        />
      </div>
    </div>
  )
}

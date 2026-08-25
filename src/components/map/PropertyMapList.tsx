import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { getLocalizedProperty } from '../../i18n/propertyTranslations'
import { getPropertySpecParts } from '../../lib/propertySummary'
import type { MapSectionContent } from '../../types/content'
import type { PropertyMapPin } from '../../types/map'
import { listingTextDir } from '../../utils/listingCopy'

interface PropertyMapListProps {
  pins: PropertyMapPin[]
  activePinId: string | null
  onPinSelect: (id: string | null) => void
  content: MapSectionContent
  neighborhoodLabel: (key: string) => string
  listingLabel: (pin: PropertyMapPin) => string
}

export default function PropertyMapList({
  pins,
  activePinId,
  onPinSelect,
  content,
  neighborhoodLabel,
  listingLabel,
}: PropertyMapListProps) {
  const { t, format, locale } = useLanguage()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!activePinId || !listRef.current) return
    const item = listRef.current.querySelector(`[data-map-pin="${activePinId}"]`)
    item?.scrollIntoView({ block: 'nearest' })
  }, [activePinId])

  return (
    <aside className="placeholder-map__list" aria-label={content.title}>
      <p className="placeholder-map__list-count">
        {format(content.listingsCount, { count: pins.length })}
      </p>
      {pins.length === 0 ? (
        <p className="placeholder-map__list-empty">{t.map.empty}</p>
      ) : (
        <ul ref={listRef}>
          {pins.map((pin) => {
            const localized = getLocalizedProperty(pin.id, locale, {
              title: pin.title,
              address: pin.address,
              description: pin.title,
              price: pin.price,
              neighborhood: pin.neighborhood,
            })
            const isActive = pin.id === activePinId

            return (
              <li key={pin.id}>
                <div
                  data-map-pin={pin.id}
                  className={`placeholder-map__list-item${isActive ? ' placeholder-map__list-item--active' : ''}`}
                >
                  <button
                    type="button"
                    className="placeholder-map__list-select"
                    aria-pressed={isActive}
                    onClick={() => onPinSelect(isActive ? null : pin.id)}
                  >
                    <span
                      className={`placeholder-map__list-type placeholder-map__list-type--${pin.listingType}`}
                    >
                      {listingLabel(pin)}
                    </span>
                    <span className="placeholder-map__list-price">
                      {localized.price ?? pin.price}
                    </span>
                    <span className="placeholder-map__list-meta">
                      {neighborhoodLabel(pin.neighborhood)}
                    </span>
                    <span className="placeholder-map__list-specs">
                      {getPropertySpecParts(pin, t).join(' · ')}
                    </span>
                    <span
                      className="placeholder-map__list-title listing-copy"
                      dir={listingTextDir(localized.title)}
                    >
                      {localized.title}
                    </span>
                  </button>
                  <Link to={pin.href} className="placeholder-map__list-link">
                    {content.viewProperty}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}

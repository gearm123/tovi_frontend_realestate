import { useLanguage } from '../../context/LanguageContext'
import { NUMBER_FORMAT_LOCALES } from '../../i18n/locales'

interface PropertyMapPriceBarProps {
  value: number
  onChange: (value: number) => void
  max: number
  step: number
}

export default function PropertyMapPriceBar({
  value,
  onChange,
  max,
  step,
}: PropertyMapPriceBarProps) {
  const { t, format, locale } = useLanguage()
  const current = Math.min(Math.max(value, 0), max)
  const amount = current.toLocaleString(NUMBER_FORMAT_LOCALES[locale])
  const label = format(t.map.priceMaxValue, { amount })

  return (
    <div
      className="property-map-shell__price"
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <span className="property-map-shell__price-label">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={t.map.priceMaxAria}
        aria-valuetext={label}
      />
    </div>
  )
}

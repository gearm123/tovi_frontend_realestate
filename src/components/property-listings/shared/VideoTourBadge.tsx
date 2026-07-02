import './VideoTourBadge.css'

interface VideoTourBadgeProps {
  label: string
  variant?: 'overlay' | 'inline'
}

export default function VideoTourBadge({
  label,
  variant = 'overlay',
}: VideoTourBadgeProps) {
  return (
    <span
      className={`video-tour-badge video-tour-badge--${variant}`}
      title={label}
      aria-label={label}
    >
      <span className="video-tour-badge__icon" aria-hidden="true" />
      <span className="video-tour-badge__label">{label}</span>
    </span>
  )
}

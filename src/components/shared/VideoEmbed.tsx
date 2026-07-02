import { isDirectVideoFile, toVideoEmbedUrl } from '../../utils/videoEmbed'
import './VideoEmbed.css'

interface VideoEmbedProps {
  videoUrl: string
  title: string
  className?: string
  /** When false, render nothing if the URL cannot be played */
  showUnavailable?: boolean
}

export default function VideoEmbed({
  videoUrl,
  title,
  className = '',
  showUnavailable = false,
}: VideoEmbedProps) {
  const trimmed = videoUrl.trim()
  if (!trimmed) return null

  const embedUrl = toVideoEmbedUrl(trimmed)

  if (isDirectVideoFile(trimmed)) {
    return (
      <div className={`video-embed ${className}`.trim()}>
        <video className="video-embed__native" src={trimmed} controls playsInline>
          <track kind="captions" />
        </video>
      </div>
    )
  }

  if (embedUrl) {
    return (
      <div className={`video-embed ${className}`.trim()}>
        <iframe
          className="video-embed__frame"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (!showUnavailable) return null

  return (
    <div className={`video-embed video-embed--unavailable ${className}`.trim()}>
      <p>Video URL will be connected when client content is ready.</p>
    </div>
  )
}

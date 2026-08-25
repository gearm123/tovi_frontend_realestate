import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropertyImage from './PropertyImage'
import './PropertyPhotoLightbox.css'

interface PropertyPhotoLightboxProps {
  images: string[]
  alt: string
  index: number
  closeLabel: string
  nextLabel: string
  previousLabel: string
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function PropertyPhotoLightbox({
  images,
  alt,
  index,
  closeLabel,
  nextLabel,
  previousLabel,
  onClose,
  onIndexChange,
}: PropertyPhotoLightboxProps) {
  const current = images[index]
  const hasMany = images.length > 1
  const touchStartX = useRef<number | null>(null)

  const goTo = (next: number) => {
    if (!hasMany) return
    onIndexChange((next + images.length) % images.length)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (!hasMany) return
      if (event.key === 'ArrowRight') goTo(index + 1)
      if (event.key === 'ArrowLeft') goTo(index - 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [hasMany, images.length, index, onClose, onIndexChange])

  if (!current) return null

  return createPortal(
    <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={alt}>
      <button type="button" className="photo-lightbox__backdrop" aria-label={closeLabel} onClick={onClose} />
      <div
        className="photo-lightbox__frame"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return
          const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
          touchStartX.current = null
          if (delta <= -40) goTo(index + 1)
          if (delta >= 40) goTo(index - 1)
        }}
      >
        <button type="button" className="photo-lightbox__close" onClick={onClose}>
          {closeLabel}
        </button>
        {hasMany && (
          <button
            type="button"
            className="photo-lightbox__nav photo-lightbox__nav--prev"
            onClick={() => goTo(index - 1)}
          >
            {previousLabel}
          </button>
        )}
        <PropertyImage
          imagePath={current}
          alt={`${alt} (${index + 1})`}
          className="photo-lightbox__image"
          priority
        />
        {hasMany && (
          <button
            type="button"
            className="photo-lightbox__nav photo-lightbox__nav--next"
            onClick={() => goTo(index + 1)}
          >
            {nextLabel}
          </button>
        )}
        {hasMany && (
          <p className="photo-lightbox__count">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>,
    document.body,
  )
}

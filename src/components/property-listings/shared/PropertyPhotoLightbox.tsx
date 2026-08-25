import { useEffect } from 'react'
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (!hasMany) return
      if (event.key === 'ArrowRight') {
        onIndexChange((index + 1) % images.length)
      }
      if (event.key === 'ArrowLeft') {
        onIndexChange((index - 1 + images.length) % images.length)
      }
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
      <div className="photo-lightbox__frame">
        <button type="button" className="photo-lightbox__close" onClick={onClose}>
          {closeLabel}
        </button>
        {hasMany && (
          <button
            type="button"
            className="photo-lightbox__nav photo-lightbox__nav--prev"
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
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
            onClick={() => onIndexChange((index + 1) % images.length)}
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

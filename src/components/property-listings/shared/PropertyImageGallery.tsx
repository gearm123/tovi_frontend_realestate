import { useState, type ReactNode, type UIEvent } from 'react'
import PropertyImage from './PropertyImage'
import PropertyPhotoLightbox from './PropertyPhotoLightbox'
import { getPropertyImages } from '../../../utils/propertyGallery'
import { useLanguage } from '../../../context/LanguageContext'
import type { Property } from '../../../types/property'
import './PropertyImageGallery.css'

interface PropertyImageGalleryProps {
  property: Pick<Property, 'image' | 'images'>
  alt: string
  label: string
  badges?: ReactNode
  variant?: 'detail' | 'card'
  priority?: boolean
}

export default function PropertyImageGallery({
  property,
  alt,
  label,
  badges,
  variant = 'detail',
  priority = false,
}: PropertyImageGalleryProps) {
  const { t } = useLanguage()
  const allImages = getPropertyImages(property)
  // Cards keep a single cover photo. Full galleries on listing pages crashed iPhone Safari.
  const images = variant === 'card' ? allImages.slice(0, 1) : allImages
  const multi = images.length > 1
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isCard = variant === 'card'

  const updateActiveIndex = (event: UIEvent<HTMLDivElement>) => {
    if (!multi) return
    const root = event.currentTarget
    const slides = root.querySelectorAll<HTMLElement>('.property-gallery__slide')
    const origin = root.getBoundingClientRect().left
    let best = 0
    let bestDist = Number.POSITIVE_INFINITY
    slides.forEach((slide, index) => {
      const dist = Math.abs(slide.getBoundingClientRect().left - origin)
      if (dist < bestDist) {
        bestDist = dist
        best = index
      }
    })
    setActiveIndex(best)
  }

  return (
    <div
      className={[
        'property-gallery',
        `property-gallery--${variant}`,
        multi ? 'property-gallery--multi' : 'property-gallery--single',
      ].join(' ')}
    >
      <div
        className="property-gallery__scroller"
        dir="ltr"
        role="region"
        aria-label={label}
        tabIndex={isCard ? undefined : 0}
        onScroll={updateActiveIndex}
      >
        {images.map((src, index) => (
          <figure key={`${src}-${index}`} className="property-gallery__slide">
            {isCard ? (
              <PropertyImage
                imagePath={src}
                alt={alt}
                className="property-gallery__image"
                priority={priority && index === 0}
              />
            ) : (
              <button
                type="button"
                className="property-gallery__open"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setLightboxIndex(index)
                }}
                aria-label={t.property.enlargePhoto}
              >
                <PropertyImage
                  imagePath={src}
                  alt={images.length > 1 ? `${alt} (${index + 1})` : alt}
                  className="property-gallery__image"
                  priority={priority && index === 0}
                />
              </button>
            )}
          </figure>
        ))}
      </div>
      {badges ? <div className="property-gallery__badges">{badges}</div> : null}
      {!isCard && images.length > 1 && (
        <p className="property-gallery__count">
          {activeIndex + 1} / {images.length}
        </p>
      )}
      {!isCard && lightboxIndex !== null && (
        <PropertyPhotoLightbox
          images={images}
          alt={alt}
          index={Math.min(lightboxIndex, images.length - 1)}
          closeLabel={t.property.closePhoto}
          nextLabel={t.property.nextPhoto}
          previousLabel={t.property.previousPhoto}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  )
}

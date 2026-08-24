import type { ReactNode } from 'react'
import PropertyImage from './PropertyImage'
import { getPropertyImages } from '../../../utils/propertyGallery'
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
  const allImages = getPropertyImages(property)
  const images = variant === 'card' ? allImages.slice(0, 1) : allImages
  const multi = images.length > 1

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
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {images.map((src, index) => (
          <figure key={`${src}-${index}`} className="property-gallery__slide">
            <PropertyImage
              imagePath={src}
              alt={images.length > 1 ? `${alt} — ${index + 1}` : alt}
              className="property-gallery__image"
              priority={priority && index === 0}
            />
          </figure>
        ))}
      </div>
      {badges ? <div className="property-gallery__badges">{badges}</div> : null}
    </div>
  )
}

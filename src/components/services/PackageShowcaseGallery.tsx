import type { PackageImage } from '../../types/content'
import './PackageShowcaseGallery.css'

interface PackageShowcaseGalleryProps {
  images: PackageImage[]
}

export default function PackageShowcaseGallery({ images }: PackageShowcaseGalleryProps) {
  if (images.length === 0) return null

  return (
    <div className="package-showcase" aria-label="ProperTLV exclusive listing showcase">
      <div className="package-showcase__grid">
        {images.map((image) => (
          <figure key={image.src} className="package-showcase__item">
            <img
              className="package-showcase__image"
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </div>
  )
}

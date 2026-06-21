import { getPropertyImageSources } from '../../../utils/propertyImages'
import './PropertyImage.css'

interface PropertyImageProps {
  imagePath: string
  alt: string
  className: string
  priority?: boolean
}

export default function PropertyImage({
  imagePath,
  alt,
  className,
  priority = false,
}: PropertyImageProps) {
  const sources = getPropertyImageSources(imagePath)

  return (
    <picture className="property-image">
      <source
        media="(max-width: 768px)"
        srcSet={sources.mobileWebp}
        type="image/webp"
      />
      <source srcSet={sources.desktopWebp} type="image/webp" />
      <img
        src={sources.desktopJpg}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        width={920}
        height={690}
      />
    </picture>
  )
}

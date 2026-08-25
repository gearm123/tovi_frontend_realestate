import { getPropertyImageSources } from '../../../utils/propertyImages'
import { PLACEHOLDER_PROPERTY_IMAGE } from '../../../data/placeholders'
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
  const webpType = /\.webp(?:$|\?)/i.test(sources.desktopWebp) ? 'image/webp' : undefined

  return (
    <picture className="property-image">
      <source
        media="(max-width: 768px)"
        srcSet={sources.mobileWebp}
        type={webpType}
      />
      <source srcSet={sources.desktopWebp} type={webpType} />
      <img
        src={sources.desktopJpg}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        width={1200}
        height={750}
        onError={(event) => {
          const img = event.currentTarget
          if (img.src.includes('property-placeholder')) return
          img.src = PLACEHOLDER_PROPERTY_IMAGE
        }}
      />
    </picture>
  )
}
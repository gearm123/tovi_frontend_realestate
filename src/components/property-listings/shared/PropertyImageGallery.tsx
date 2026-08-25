import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type UIEvent } from 'react'
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
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const pointerMoved = useRef(false)

  useEffect(() => {
    const root = scrollerRef.current
    if (!root || isCard || !multi) return

    const galleryEl = root.parentElement ?? root
    const coarse = window.matchMedia('(pointer: coarse)')
    let startX = 0
    let startY = 0
    let startScroll = 0
    let startIndex = 0
    let axis: 'x' | 'y' | null = null

    const syncTouchMode = () => {
      root.classList.toggle('property-gallery__scroller--touch', coarse.matches)
    }

    const slides = () => [...root.querySelectorAll<HTMLElement>('.property-gallery__slide')]

    const closestIndex = () => {
      const origin = root.getBoundingClientRect().left
      let best = 0
      let bestDist = Number.POSITIVE_INFINITY
      slides().forEach((slide, index) => {
        const dist = Math.abs(slide.getBoundingClientRect().left - origin)
        if (dist < bestDist) {
          bestDist = dist
          best = index
        }
      })
      return best
    }

    const slideLeft = (index: number) => {
      const slide = slides()[index]
      if (!slide) return 0
      return root.scrollLeft + (slide.getBoundingClientRect().left - root.getBoundingClientRect().left)
    }

    const snapToNearest = () => {
      const list = slides()
      if (list.length === 0) return
      const width = list[0].getBoundingClientRect().width
      const traveled = root.scrollLeft - startScroll
      let next = startIndex
      if (traveled > width * 0.18) next = startIndex + 1
      else if (traveled < -width * 0.18) next = startIndex - 1
      next = Math.max(0, Math.min(list.length - 1, next))
      root.scrollTo({ left: slideLeft(next), behavior: 'smooth' })
    }

    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      startX = touch.clientX
      startY = touch.clientY
      startScroll = root.scrollLeft
      startIndex = closestIndex()
      axis = null
    }

    const onMove = (event: TouchEvent) => {
      if (!coarse.matches) return
      const touch = event.touches[0]
      if (!touch) return
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x'
      }
      if (axis !== 'x') return
      root.scrollLeft = startScroll - dx
    }

    const onEnd = () => {
      if (coarse.matches && axis === 'x') snapToNearest()
      axis = null
    }

    syncTouchMode()
    coarse.addEventListener('change', syncTouchMode)
    galleryEl.addEventListener('touchstart', onStart, { passive: true, capture: true })
    galleryEl.addEventListener('touchmove', onMove, { passive: true, capture: true })
    galleryEl.addEventListener('touchend', onEnd, { passive: true, capture: true })
    galleryEl.addEventListener('touchcancel', onEnd, { passive: true, capture: true })

    return () => {
      root.classList.remove('property-gallery__scroller--touch')
      coarse.removeEventListener('change', syncTouchMode)
      galleryEl.removeEventListener('touchstart', onStart, true)
      galleryEl.removeEventListener('touchmove', onMove, true)
      galleryEl.removeEventListener('touchend', onEnd, true)
      galleryEl.removeEventListener('touchcancel', onEnd, true)
    }
  }, [isCard, multi])

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

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY }
    pointerMoved.current = false
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!pointerStart.current) return
    const dx = Math.abs(event.clientX - pointerStart.current.x)
    const dy = Math.abs(event.clientY - pointerStart.current.y)
    if (dx > 8 || dy > 8) pointerMoved.current = true
  }

  const openPhoto = (index: number, fromKeyboard = false) => {
    if (!fromKeyboard && pointerMoved.current) return
    setLightboxIndex(index)
  }

  const onSlideKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPhoto(index, true)
    }
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
        ref={scrollerRef}
        className="property-gallery__scroller"
        dir="ltr"
        role="region"
        aria-label={label}
        tabIndex={isCard ? undefined : 0}
        onScroll={updateActiveIndex}
      >
        {images.map((src, index) => (
          <figure
            key={`${src}-${index}`}
            className="property-gallery__slide"
            {...(isCard
              ? {}
              : {
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': t.property.enlargePhoto,
                  onPointerDown,
                  onPointerMove,
                  onClick: () => openPhoto(index),
                  onKeyDown: (event: KeyboardEvent<HTMLElement>) => onSlideKeyDown(event, index),
                })}
          >
            <PropertyImage
              imagePath={src}
              alt={isCard || images.length === 1 ? alt : `${alt} (${index + 1})`}
              className="property-gallery__image"
              priority={priority && index === 0}
            />
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

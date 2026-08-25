import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { neighborhoods, propertyTypes } from '../../services/propertyService'
import { useSiteData } from '../../hooks/useSiteData'
import {
  createBlankProperty,
  formatListingPrice,
  updateSiteData,
} from '../../lib/siteDataStore'
import type { ListingType, Property, PropertyType } from '../../types/property'
import './adminShared.css'

const featureKeys = [
  ['balcony', 'Balcony'],
  ['parking', 'Parking'],
  ['elevator', 'Elevator'],
  ['mamad', 'Mamad'],
  ['miklat', 'Miklat'],
  ['petsAllowed', 'Pets allowed'],
] as const

export default function AdminListingFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { properties, agents } = useSiteData()

  const existing = useMemo(
    () => (isNew ? undefined : properties.find((p) => p.id === id)),
    [isNew, properties, id],
  )

  const [form, setForm] = useState<Property>(() => createBlankProperty('sale'))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew) {
      setForm(createBlankProperty('sale'))
      return
    }
    if (existing) setForm(existing)
  }, [isNew, existing])

  if (!isNew && !existing) {
    return <Navigate to="/admin/listings" replace />
  }

  const setField = <K extends keyof Property>(key: K, value: Property[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'priceNumeric' || key === 'listingType') {
        next.price = formatListingPrice(
          key === 'priceNumeric' ? (value as number) : next.priceNumeric,
          key === 'listingType' ? (value as ListingType) : next.listingType,
        )
      }
      if (key === 'image') {
        const cover = String(value ?? '').trim()
        const rest = (prev.images ?? []).slice(1).filter((src) => src && src !== cover)
        next.images = cover ? [cover, ...rest] : rest
      }
      if (key === 'images') {
        const images = (value as string[]).map((src) => src.trim()).filter(Boolean)
        next.images = images
        next.image = images[0] ?? prev.image
      }
      return next
    })
    setSaved(false)
  }

  const handleImageFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setField('image', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const galleryText = (form.images ?? (form.image ? [form.image] : []))
    .filter((src) => !src.startsWith('data:'))
    .join('\n')

  const setGalleryFromText = (text: string) => {
    const urls = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const dataCover = (form.images ?? []).find((src) => src.startsWith('data:'))
    setField('images', dataCover ? [dataCover, ...urls] : urls)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.address.trim()) {
      window.alert('Title and address are required.')
      return
    }

    const images = (form.images ?? [])
      .map((src) => src.trim())
      .filter(Boolean)
    const cover = images[0] || form.image.trim() || ''

    const payload: Property = {
      ...form,
      title: form.title.trim(),
      address: form.address.trim(),
      description: form.description.trim(),
      videoUrl: form.videoUrl?.trim() || undefined,
      image: cover,
      images: images.length > 0 ? images : cover ? [cover] : [],
      price: formatListingPrice(form.priceNumeric, form.listingType),
    }

    updateSiteData((data) => {
      if (isNew) {
        return { ...data, properties: [payload, ...data.properties] }
      }
      return {
        ...data,
        properties: data.properties.map((p) => (p.id === payload.id ? payload : p)),
      }
    })

    setSaved(true)
    if (isNew) {
      navigate(`/admin/listings/${payload.id}`, { replace: true })
    }
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{isNew ? 'Add listing' : 'Edit listing'}</h1>
          <p className="admin-page__subtitle">
            {isNew ? 'Create a new sale or rental listing.' : `Editing ${form.id}`}
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn admin-btn--secondary" to="/admin/listings">
            Back to listings
          </Link>
        </div>
      </header>

      {saved ? (
        <p className="admin-notice admin-notice--success">Listing saved. Public site updated.</p>
      ) : null}

      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="listing-title">Title</label>
              <input
                id="listing-title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-type">Listing type</label>
              <select
                id="listing-type"
                value={form.listingType}
                onChange={(e) => setField('listingType', e.target.value as ListingType)}
              >
                <option value="sale">Sale</option>
                <option value="rental">Rental</option>
              </select>
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="listing-address">Address</label>
              <input
                id="listing-address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-neighborhood">Neighborhood</label>
              <input
                id="listing-neighborhood"
                list="neighborhood-options"
                value={form.neighborhood}
                onChange={(e) => setField('neighborhood', e.target.value)}
              />
              <datalist id="neighborhood-options">
                {neighborhoods.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div className="admin-field">
              <label htmlFor="listing-property-type">Property type</label>
              <select
                id="listing-property-type"
                value={form.propertyType}
                onChange={(e) => setField('propertyType', e.target.value as PropertyType)}
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="listing-price">Price (number)</label>
              <input
                id="listing-price"
                type="number"
                min={0}
                step={form.listingType === 'rental' ? 100 : 1000}
                value={form.priceNumeric}
                onChange={(e) => setField('priceNumeric', Number(e.target.value) || 0)}
                required
              />
            </div>
            <div className="admin-field">
              <label>Display price</label>
              <input value={form.price} readOnly />
            </div>
          </div>

          <div className="admin-form__grid admin-form__grid--3">
            <div className="admin-field">
              <label htmlFor="listing-rooms">Rooms</label>
              <input
                id="listing-rooms"
                type="number"
                min={1}
                step={0.5}
                value={form.rooms}
                onChange={(e) => setField('rooms', Number(e.target.value) || 0)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-bedrooms">Bedrooms</label>
              <input
                id="listing-bedrooms"
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(e) => setField('bedrooms', Number(e.target.value) || 0)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-bathrooms">Bathrooms</label>
              <input
                id="listing-bathrooms"
                type="number"
                min={0}
                step={0.5}
                value={form.bathrooms}
                onChange={(e) => setField('bathrooms', Number(e.target.value) || 0)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-area">Area (m²)</label>
              <input
                id="listing-area"
                type="number"
                min={0}
                value={form.area}
                onChange={(e) => setField('area', Number(e.target.value) || 0)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-agent">Agent</label>
              <select
                id="listing-agent"
                value={form.agentId}
                onChange={(e) => setField('agentId', e.target.value)}
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <div className="admin-checkboxes">
                <label className="admin-checkbox" htmlFor="listing-featured">
                  <input
                    id="listing-featured"
                    type="checkbox"
                    checked={Boolean(form.featured)}
                    onChange={(e) => setField('featured', e.target.checked)}
                  />
                  Featured
                </label>
                <label className="admin-checkbox" htmlFor="listing-exclusive">
                  <input
                    id="listing-exclusive"
                    type="checkbox"
                    checked={Boolean(form.exclusive)}
                    onChange={(e) => setField('exclusive', e.target.checked)}
                  />
                  Exclusive
                </label>
                <label className="admin-checkbox" htmlFor="listing-new">
                  <input
                    id="listing-new"
                    type="checkbox"
                    checked={Boolean(form.isNew)}
                    onChange={(e) => setField('isNew', e.target.checked)}
                  />
                  New
                </label>
              </div>
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="listing-description">Description</label>
            <textarea
              id="listing-description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div className="admin-form__grid">
            <div className="admin-field admin-field--full">
              <label htmlFor="listing-images">Gallery image URLs (one per line)</label>
              <textarea
                id="listing-images"
                rows={4}
                value={galleryText}
                placeholder={'/assets/properties/1.jpg\n/assets/properties/2.jpg'}
                onChange={(e) => setGalleryFromText(e.target.value)}
              />
              <p className="admin-field__hint">
                First URL is the cover image used on cards and search results.
              </p>
            </div>
            <div className="admin-field">
              <label htmlFor="listing-image-file">Or upload cover image</label>
              <input
                id="listing-image-file"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
              />
            </div>
            <div className="admin-field admin-field--full">
              <label htmlFor="listing-video">Video tour URL (optional)</label>
              <input
                id="listing-video"
                value={form.videoUrl ?? ''}
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => setField('videoUrl', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-lat">Latitude</label>
              <input
                id="listing-lat"
                type="number"
                step="0.0001"
                value={form.coordinates.lat}
                onChange={(e) =>
                  setField('coordinates', {
                    ...form.coordinates,
                    lat: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-lng">Longitude</label>
              <input
                id="listing-lng"
                type="number"
                step="0.0001"
                value={form.coordinates.lng}
                onChange={(e) =>
                  setField('coordinates', {
                    ...form.coordinates,
                    lng: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Features</label>
            <div className="admin-checkboxes">
              {featureKeys.map(([key, label]) => (
                <label key={key} className="admin-checkbox" htmlFor={`feature-${key}`}>
                  <input
                    id={`feature-${key}`}
                    type="checkbox"
                    checked={form.features[key]}
                    onChange={(e) =>
                      setField('features', { ...form.features, [key]: e.target.checked })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {(form.images?.length || form.image) ? (
            <div className="admin-field">
              <label>Gallery preview</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(form.images?.length ? form.images : [form.image]).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: '1px solid #c3c4c7',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="admin-form__footer">
            <button type="submit" className="admin-btn">
              {isNew ? 'Create listing' : 'Save changes'}
            </button>
            <Link className="admin-btn admin-btn--secondary" to="/admin/listings">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </div>
  )
}

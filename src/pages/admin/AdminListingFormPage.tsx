import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { neighborhoods, propertyTypes } from '../../services/propertyService'
import { useSiteData } from '../../hooks/useSiteData'
import {
  createBlankProperty,
  formatListingPrice,
  updateSiteData,
} from '../../lib/siteDataStore'
import { draftListingCopy, linesToList, listToLines } from '../../lib/listingCopyDraft'
import { cleanListingText } from '../../utils/listingCopy'
import type { ListingType, Property, PropertyType } from '../../types/property'
import AdminListingGallery from './AdminListingGallery'
import './adminShared.css'

const featureKeys = [
  ['balcony', 'Balcony'],
  ['parking', 'Parking'],
  ['elevator', 'Elevator'],
  ['mamad', 'Safe room (Mamad)'],
  ['miklat', 'Building shelter (Miklat)'],
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

  const areaOptions = useMemo(() => {
    const current = form.neighborhood?.trim()
    if (current && !(neighborhoods as readonly string[]).includes(current)) {
      return [current, ...neighborhoods]
    }
    return [...neighborhoods]
  }, [form.neighborhood])

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
      if (key === 'images') {
        const images = (value as string[]).map((src) => src.trim()).filter(Boolean)
        next.images = images
        next.image = images[0] ?? ''
      }
      return next
    })
    setSaved(false)
  }

  const applyDraft = (mode: 'fill' | 'replace') => {
    const draft = draftListingCopy(form)
    const hasCopy = Boolean(form.description.trim() || (form.highlights ?? []).length)
    if (mode === 'replace' && hasCopy) {
      const ok = window.confirm('Replace the current description and highlights with a new draft?')
      if (!ok) return
    }
    setForm((prev) => ({
      ...prev,
      description: mode === 'fill' && prev.description.trim() ? prev.description : draft.description,
      highlights:
        mode === 'fill' && (prev.highlights ?? []).length ? prev.highlights : draft.highlights,
    }))
    setSaved(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title.trim() || !form.address.trim()) {
      window.alert('Title and address are required.')
      return
    }

    const images = (form.images ?? []).map((src) => src.trim()).filter(Boolean)
    const cover = images[0] || form.image.trim() || ''

    const payload: Property = {
      ...form,
      title: cleanListingText(form.title),
      address: cleanListingText(form.address),
      description: cleanListingText(form.description),
      floor: form.floor?.trim() || undefined,
      highlights: (form.highlights ?? []).map(cleanListingText).filter(Boolean),
      specialNotes: (form.specialNotes ?? []).map(cleanListingText).filter(Boolean),
      videoUrl: form.videoUrl?.trim() || undefined,
      image: cover,
      images,
      price: formatListingPrice(form.priceNumeric, form.listingType),
    }

    updateSiteData((data) => {
      if (isNew) {
        return { ...data, properties: [payload, ...data.properties] }
      }
      return {
        ...data,
        properties: data.properties.map((item) => (item.id === payload.id ? payload : item)),
      }
    })

    setSaved(true)
    if (isNew) {
      navigate(`/admin/listings/${payload.id}`, { replace: true })
    }
  }

  const gallery = form.images?.length ? form.images : form.image ? [form.image] : []

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{isNew ? 'Add listing' : 'Edit listing'}</h1>
          <p className="admin-page__subtitle">
            Fill in the fields below. Price, facts, and listing text stay in a consistent format
            automatically.
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
          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Listing</h2>
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="listing-type">Buy / Rent</label>
                <select
                  id="listing-type"
                  value={form.listingType}
                  onChange={(e) => setField('listingType', e.target.value as ListingType)}
                >
                  <option value="sale">Buy (for sale)</option>
                  <option value="rental">Rent</option>
                </select>
              </div>
              <div className="admin-field">
                <label htmlFor="listing-property-type">Property type</label>
                <select
                  id="listing-property-type"
                  value={form.propertyType}
                  onChange={(e) => setField('propertyType', e.target.value as PropertyType)}
                >
                  {propertyTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-field admin-field--full">
                <label htmlFor="listing-title">Title</label>
                <input
                  id="listing-title"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Location</h2>
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="listing-neighborhood">Area</label>
                <select
                  id="listing-neighborhood"
                  value={form.neighborhood}
                  onChange={(e) => setField('neighborhood', e.target.value)}
                >
                  {areaOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
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
                <label htmlFor="listing-lat">Map latitude (optional)</label>
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
                <label htmlFor="listing-lng">Map longitude (optional)</label>
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
          </div>

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Price and size</h2>
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="listing-price">
                  {form.listingType === 'rental' ? 'Monthly rent (number only)' : 'Price (number only)'}
                </label>
                <input
                  id="listing-price"
                  type="number"
                  min={0}
                  step={form.listingType === 'rental' ? 100 : 1000}
                  value={form.priceNumeric}
                  onChange={(e) => setField('priceNumeric', Number(e.target.value) || 0)}
                  required
                />
                <p className="admin-field__hint">Shown on the site as {form.price}</p>
              </div>
              <div className="admin-field">
                <label htmlFor="listing-area">Property size (m²)</label>
                <input
                  id="listing-area"
                  type="number"
                  min={0}
                  value={form.area}
                  onChange={(e) => setField('area', Number(e.target.value) || 0)}
                />
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
                <label htmlFor="listing-floor">Floor</label>
                <input
                  id="listing-floor"
                  value={form.floor ?? ''}
                  placeholder="e.g. 3, Ground, or 5 of 8"
                  onChange={(e) => setField('floor', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Features</h2>
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

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Status</h2>
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

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Listing text</h2>
            <p className="admin-form__section-copy">
              Write freely, or generate a draft from the details above. Highlights become bullets on
              the listing page. You do not need headings or special formatting.
            </p>
            <div className="admin-copy-actions">
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => applyDraft('fill')}
              >
                Draft from details
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={() => applyDraft('replace')}
              >
                Rewrite from details
              </button>
            </div>
            <div className="admin-field">
              <label htmlFor="listing-description">Main description</label>
              <textarea
                id="listing-description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-highlights">Special highlights (one per line)</label>
              <textarea
                id="listing-highlights"
                value={listToLines(form.highlights)}
                placeholder={'Sea view\nRenovated kitchen\nQuiet street'}
                onChange={(e) => setField('highlights', linesToList(e.target.value))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="listing-special">Special information (optional, one per line)</label>
              <textarea
                id="listing-special"
                value={listToLines(form.specialNotes)}
                placeholder={'TAMA 38 potential\nOff-market'}
                onChange={(e) => setField('specialNotes', linesToList(e.target.value))}
              />
            </div>
          </div>

          <div className="admin-form__section">
            <h2 className="admin-form__section-title">Photos</h2>
            <AdminListingGallery images={gallery} onChange={(images) => setField('images', images)} />
            <div className="admin-field">
              <label htmlFor="listing-video">Video tour URL (optional)</label>
              <input
                id="listing-video"
                value={form.videoUrl ?? ''}
                placeholder="https://www.youtube.com/watch?v=..."
                onChange={(e) => setField('videoUrl', e.target.value)}
              />
            </div>
          </div>

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

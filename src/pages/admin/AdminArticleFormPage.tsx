import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSiteData } from '../../hooks/useSiteData'
import {
  articleSlug,
  createBlankArticle,
  galleryFromArticle,
  isArticleType,
  paragraphsToText,
  textToParagraphs,
} from '../../lib/magazineArticles'
import { refreshArticles, upsertCachedArticle } from '../../lib/siteDataStore'
import { saveArticle, uploadListingImage } from '../../services/listingsApi'
import type { MagazineArticle, MagazineGalleryImage } from '../../types/magazine'
import './adminShared.css'

export default function AdminArticleFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { articles, articlesStatus, articlesError } = useSiteData()
  const existing = isNew ? undefined : articles.find((article) => article.id === id)

  const [form, setForm] = useState<MagazineArticle>(() => existing ?? createBlankArticle())
  const [bodyText, setBodyText] = useState(() => paragraphsToText((existing ?? createBlankArticle()).body))
  const [hebrewTitle, setHebrewTitle] = useState(() => existing?.hebrew?.title ?? '')
  const [hebrewExcerpt, setHebrewExcerpt] = useState(() => existing?.hebrew?.excerpt ?? '')
  const [hebrewBody, setHebrewBody] = useState(() => paragraphsToText(existing?.hebrew?.body ?? []))
  const [images, setImages] = useState<MagazineGalleryImage[]>(() => galleryFromArticle(existing))
  const [coverSrc, setCoverSrc] = useState(
    () => existing?.image.trim() || galleryFromArticle(existing)[0]?.src || '',
  )
  const [slugEdited, setSlugEdited] = useState(Boolean(existing?.slug))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!existing) return
    setForm(existing)
    setBodyText(paragraphsToText(existing.body))
    setHebrewTitle(existing.hebrew?.title ?? '')
    setHebrewExcerpt(existing.hebrew?.excerpt ?? '')
    setHebrewBody(paragraphsToText(existing.hebrew?.body ?? []))
    setImages(galleryFromArticle(existing))
    setCoverSrc(existing.image.trim() || galleryFromArticle(existing)[0]?.src || '')
    setSlugEdited(true)
  }, [existing])

  if (!isNew && articlesStatus === 'loading' && !existing) {
    return <p className="admin-page__subtitle">Loading article…</p>
  }

  if (!isNew && articlesStatus !== 'loading' && !existing) {
    return articlesStatus === 'error' ? (
      <p className="admin-notice admin-notice--warn">{articlesError}</p>
    ) : (
      <Navigate to="/admin/magazine" replace />
    )
  }

  const setField = <K extends keyof MagazineArticle>(key: K, value: MagazineArticle[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !slugEdited) next.slug = articleSlug(String(value))
      return next
    })
    setSaved(false)
    setError('')
    setNotice('')
  }

  const updateImages = (next: MagazineGalleryImage[], cover = coverSrc) => {
    const nextCover = next.some((image) => image.src.trim() === cover.trim())
      ? cover.trim()
      : (next[0]?.src.trim() ?? '')
    setImages(next)
    setCoverSrc(nextCover)
    setField('image', nextCover)
  }

  const handleImage = async (file: File | undefined, index: number | null) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadListingImage(file)
      if (index === null) {
        const coverIndex = images.findIndex((image) => image.src.trim() === coverSrc.trim())
        const next = images.slice()
        next.splice(coverIndex >= 0 ? coverIndex : next.length, 0, {
          src: url,
          caption: '',
          hebrewCaption: '',
        })
        updateImages(next)
      } else {
        const wasCover = images[index]?.src.trim() === coverSrc.trim()
        updateImages(
          images.map((image, imageIndex) => (imageIndex === index ? { ...image, src: url } : image)),
          wasCover ? url : coverSrc,
        )
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not upload that image.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const hebrewParagraphs = textToParagraphs(hebrewBody)
    const hebrewTitleText = hebrewTitle.trim()
    const hebrewExcerptText = hebrewExcerpt.trim()
    const article: MagazineArticle = {
      ...form,
      title: form.title.trim(),
      slug: articleSlug(form.slug || form.title),
      category: form.category.trim(),
      date: form.date.trim(),
      excerpt: form.excerpt.trim(),
      videoUrl: form.videoUrl?.trim() || undefined,
      body: textToParagraphs(bodyText),
      images: images
        .map((image) => ({
          src: image.src.trim(),
          caption: image.caption.trim(),
          hebrewCaption: image.hebrewCaption.trim(),
        }))
        .filter((image) => image.src),
      image: coverSrc.trim() || images.find((image) => image.src.trim())?.src.trim() || '',
      hebrew: hebrewTitleText || hebrewExcerptText || hebrewParagraphs.length
        ? {
            category: '',
            title: hebrewTitleText,
            excerpt: hebrewExcerptText,
            date: '',
            body: hebrewParagraphs,
          }
        : undefined,
      source: form.source?.name.trim() || form.source?.url.trim() || form.source?.credit.trim()
        ? {
            name: form.source?.name.trim() ?? '',
            url: form.source?.url.trim() ?? '',
            credit: form.source?.credit.trim() ?? '',
          }
        : undefined,
    }
    if (!article.title || !article.category || !article.date || !article.excerpt || !article.image) {
      setError('Title, category, date, summary, and image are required.')
      return
    }
    if (!article.body.length) {
      setError('Add at least one paragraph. Separate paragraphs with a blank line.')
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const savedArticle = await saveArticle(article)
      upsertCachedArticle(savedArticle.article)
      await refreshArticles()
      setSaved(true)
      setNotice(savedArticle.warning ?? '')
      if (isNew) navigate(`/admin/magazine/${savedArticle.article.id}`, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save that article.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{isNew ? 'New article' : 'Edit article'}</h1>
          <p className="admin-page__subtitle">
            Write the article in English. French and Russian are filled in on save. Hebrew you type
            below is kept as written.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn admin-btn--secondary" to="/admin/magazine">
            Back
          </Link>
          <button className="admin-btn" type="submit" disabled={saving || uploading}>
            {saving ? 'Saving…' : 'Save article'}
          </button>
        </div>
      </header>

      {error ? <div className="admin-notice admin-notice--warn">{error}</div> : null}
      {notice ? <div className="admin-notice admin-notice--warn">{notice}</div> : null}
      {saved && !notice ? <div className="admin-notice admin-notice--success">Saved.</div> : null}

      <section className="admin-card">
        <div className="admin-form__grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="article-title">Title</label>
            <input
              id="article-title"
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="article-slug">Link</label>
            <input
              id="article-slug"
              value={form.slug}
              onChange={(event) => {
                setSlugEdited(true)
                setField('slug', event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
              }}
            />
            <p className="admin-field__hint">The public address is /magazine/{form.slug || '…'}</p>
          </div>
          <div className="admin-field">
            <label htmlFor="article-type">Type</label>
            <select
              id="article-type"
              value={form.type}
              onChange={(event) => {
                if (isArticleType(event.target.value)) setField('type', event.target.value)
              }}
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="article-category">Category</label>
            <input
              id="article-category"
              value={form.category}
              placeholder="Market"
              onChange={(event) => setField('category', event.target.value)}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="article-date">Date</label>
            <input
              id="article-date"
              value={form.date}
              placeholder="June 2026"
              onChange={(event) => setField('date', event.target.value)}
              required
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="article-excerpt">Summary</label>
            <textarea
              id="article-excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(event) => setField('excerpt', event.target.value)}
              required
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="article-body">Body</label>
            <textarea
              id="article-body"
              rows={16}
              value={bodyText}
              onChange={(event) => {
                setBodyText(event.target.value)
                setSaved(false)
                setError('')
              }}
            />
            <p className="admin-field__hint">Separate paragraphs with a blank line.</p>
          </div>
          <div className="admin-field admin-field--full">
            <label>Images</label>
            <p className="admin-field__hint">
              Add photo above cover places the new photo over the cover on the article. The cover
              stays the photo on the magazine list.
            </p>
            <div className="admin-article-photos">
              {images.map((image, index) => (
                <div className="admin-article-photos__item" key={`${image.src}-${index}`}>
                  <div className="admin-article-photos__preview">
                    {image.src.trim() === coverSrc.trim() ? (
                      <span className="admin-article-photos__cover">Cover</span>
                    ) : null}
                    {image.src ? <img src={image.src} alt="" /> : null}
                  </div>
                  <div className="admin-article-photos__fields">
                    <input
                      value={image.src}
                      placeholder="/assets/… or an uploaded photo"
                      aria-label={`Image ${index + 1} address`}
                      onChange={(event) =>
                        updateImages(
                          images.map((item, imageIndex) =>
                            imageIndex === index ? { ...item, src: event.target.value } : item,
                          ),
                        )
                      }
                    />
                    <input
                      value={image.caption}
                      placeholder="Caption"
                      aria-label={`Image ${index + 1} caption`}
                      onChange={(event) =>
                        updateImages(
                          images.map((item, imageIndex) =>
                            imageIndex === index ? { ...item, caption: event.target.value } : item,
                          ),
                        )
                      }
                    />
                    <input
                      dir="rtl"
                      lang="he"
                      value={image.hebrewCaption}
                      placeholder="כיתוב בעברית"
                      aria-label={`Image ${index + 1} Hebrew caption`}
                      onChange={(event) =>
                        updateImages(
                          images.map((item, imageIndex) =>
                            imageIndex === index ? { ...item, hebrewCaption: event.target.value } : item,
                          ),
                        )
                      }
                    />
                    <div className="admin-page__actions">
                      {image.src.trim() === coverSrc.trim() ? (
                      <label className="admin-btn admin-btn--small">
                        {uploading ? 'Uploading…' : 'Add photo above cover'}
                        <input
                          className="admin-article-photos__file"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          disabled={uploading}
                          onChange={(event) => {
                            void handleImage(event.target.files?.[0], null)
                            event.target.value = ''
                          }}
                        />
                      </label>
                      ) : null}
                      <label className="admin-btn admin-btn--secondary admin-btn--small">
                        {uploading ? 'Uploading…' : 'Replace photo'}
                        <input
                          className="admin-article-photos__file"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          disabled={uploading}
                          onChange={(event) => {
                            void handleImage(event.target.files?.[0], index)
                            event.target.value = ''
                          }}
                        />
                      </label>
                      <button
                        className="admin-btn admin-btn--secondary admin-btn--small"
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const next = images.slice()
                          const [moved] = next.splice(index, 1)
                          next.splice(index - 1, 0, moved)
                          updateImages(next)
                        }}
                      >
                        Move up
                      </button>
                      <button
                        className="admin-btn admin-btn--danger admin-btn--small"
                        type="button"
                        onClick={() => updateImages(images.filter((_, imageIndex) => imageIndex !== index))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {form.type === 'video' ? (
            <div className="admin-field admin-field--full">
              <label htmlFor="article-video">Video link</label>
              <input
                id="article-video"
                value={form.videoUrl ?? ''}
                placeholder="https://www.youtube.com/watch?v=…"
                onChange={(event) => setField('videoUrl', event.target.value)}
              />
            </div>
          ) : null}
          <div className="admin-field">
            <label htmlFor="article-source-name">Source name</label>
            <input
              id="article-source-name"
              value={form.source?.name ?? ''}
              placeholder="TheMarker"
              onChange={(event) =>
                setField('source', {
                  name: event.target.value,
                  url: form.source?.url ?? '',
                  credit: form.source?.credit ?? '',
                })
              }
            />
          </div>
          <div className="admin-field">
            <label htmlFor="article-source-url">Source link</label>
            <input
              id="article-source-url"
              value={form.source?.url ?? ''}
              onChange={(event) =>
                setField('source', {
                  name: form.source?.name ?? '',
                  url: event.target.value,
                  credit: form.source?.credit ?? '',
                })
              }
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="article-source-credit">Source credit</label>
            <input
              id="article-source-credit"
              value={form.source?.credit ?? ''}
              onChange={(event) =>
                setField('source', {
                  name: form.source?.name ?? '',
                  url: form.source?.url ?? '',
                  credit: event.target.value,
                })
              }
            />
          </div>
          <div className="admin-field admin-field--full">
            <label>
              <input
                type="checkbox"
                checked={form.isPlaceholder}
                onChange={(event) => setField('isPlaceholder', event.target.checked)}
              />{' '}
              Show the sample label on the site
            </label>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Hebrew</h2>
        <p className="admin-page__subtitle">
          Enter the Hebrew title, summary, and article here. Text in these fields is published
          as written, from right to left, and is not translated from the English. Leave them
          blank to keep the automatic Hebrew translation.
        </p>
        <div className="admin-form__grid">
          <div className="admin-field admin-field--full">
            <label htmlFor="article-hebrew-title">Hebrew title</label>
            <input
              id="article-hebrew-title"
              dir="rtl"
              lang="he"
              value={hebrewTitle}
              onChange={(event) => {
                setHebrewTitle(event.target.value)
                setSaved(false)
                setError('')
              }}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="article-hebrew-excerpt">Hebrew summary</label>
            <textarea
              id="article-hebrew-excerpt"
              dir="rtl"
              lang="he"
              rows={3}
              value={hebrewExcerpt}
              onChange={(event) => {
                setHebrewExcerpt(event.target.value)
                setSaved(false)
                setError('')
              }}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="article-hebrew-body">Hebrew article</label>
            <textarea
              id="article-hebrew-body"
              dir="rtl"
              lang="he"
              rows={16}
              value={hebrewBody}
              onChange={(event) => {
                setHebrewBody(event.target.value)
                setSaved(false)
                setError('')
              }}
            />
            <p className="admin-field__hint">Separate Hebrew paragraphs with a blank line.</p>
          </div>
        </div>
      </section>
    </form>
  )
}

import { useRef, type DragEvent } from 'react'

interface AdminListingGalleryProps {
  images: string[]
  onChange: (images: string[]) => void
}

function readFiles(files: FileList | File[]): Promise<string[]> {
  return Promise.all(
    Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === 'string') resolve(reader.result)
              else reject(new Error('Could not read image'))
            }
            reader.onerror = () => reject(reader.error ?? new Error('Could not read image'))
            reader.readAsDataURL(file)
          }),
      ),
  )
}

export default function AdminListingGallery({ images, onChange }: AdminListingGalleryProps) {
  const dragFrom = useRef<number | null>(null)
  const urlInput = useRef<HTMLInputElement>(null)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    const added = await readFiles(fileList)
    if (added.length) onChange([...images, ...added])
  }

  const addUrl = () => {
    const value = urlInput.current?.value.trim()
    if (!value) return
    onChange([...images, value])
    if (urlInput.current) urlInput.current.value = ''
  }

  const onDragStart = (index: number) => (event: DragEvent<HTMLElement>) => {
    dragFrom.current = index
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (index: number) => (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    const from = dragFrom.current
    dragFrom.current = null
    if (from == null || from === index) return
    move(from, index)
  }

  return (
    <div className="admin-gallery">
      <div className="admin-gallery__toolbar">
        <label className="admin-btn admin-btn--secondary">
          Upload photos
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              void addFiles(event.target.files)
              event.target.value = ''
            }}
          />
        </label>
        <p className="admin-field__hint">
          First photo is the cover. Drag photos or use the arrows to change order.
        </p>
      </div>

      {images.length === 0 ? (
        <p className="admin-empty">No photos yet. Upload images or paste a URL below.</p>
      ) : (
        <ul className="admin-gallery__grid">
          {images.map((src, index) => (
            <li
              key={`${src.slice(0, 48)}-${index}`}
              className={`admin-gallery__item${index === 0 ? ' admin-gallery__item--cover' : ''}`}
              draggable
              onDragStart={onDragStart(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={onDrop(index)}
            >
              <img src={src} alt="" />
              {index === 0 ? <span className="admin-gallery__badge">Cover</span> : null}
              <div className="admin-gallery__controls">
                <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0}>
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                >
                  Down
                </button>
                <button type="button" onClick={() => move(index, 0)} disabled={index === 0}>
                  Cover
                </button>
                <button
                  type="button"
                  className="admin-gallery__remove"
                  onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="admin-gallery__url">
        <input
          ref={urlInput}
          type="text"
          placeholder="Optional: paste an image URL"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addUrl()
            }
          }}
        />
        <button type="button" className="admin-btn admin-btn--secondary" onClick={addUrl}>
          Add URL
        </button>
      </div>
    </div>
  )
}

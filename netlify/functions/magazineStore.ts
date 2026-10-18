import { getDatabase } from '@netlify/database'
import { buildStoredMagazineArticles } from '../../src/data/magazine/stored'
import type {
  MagazineArticle,
  MagazineGalleryImage,
  MagazineLocaleCopy,
  MagazineSource,
} from '../../src/types/magazine'
import { translateMagazineFields } from './translateListing'

const LOCALES = ['en', 'he', 'fr', 'ru'] as const

export class ArticleInputError extends Error {}

let seedPromise: Promise<void> | null = null

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanSource(value: MagazineSource | undefined): MagazineSource | undefined {
  if (!value) return undefined
  const name = clean(value.name)
  const url = clean(value.url)
  const credit = clean(value.credit)
  if (!name && !url && !credit) return undefined
  return { name, url, credit }
}

function cleanCopy(value: MagazineLocaleCopy | undefined): MagazineLocaleCopy | undefined {
  if (!value) return undefined
  const body = (value.body ?? []).map((paragraph) => clean(paragraph)).filter(Boolean)
  const captions = (value.captions ?? []).map((caption) => clean(caption))
  const next: MagazineLocaleCopy = {
    category: clean(value.category),
    title: clean(value.title),
    excerpt: clean(value.excerpt),
    date: clean(value.date),
    body,
    source: cleanSource(value.source),
    captions: captions.some(Boolean) ? captions : undefined,
  }
  if (
    !next.category &&
    !next.title &&
    !next.excerpt &&
    !next.date &&
    !next.body.length &&
    !next.source &&
    !next.captions
  ) {
    return undefined
  }
  return next
}

function cleanImages(input: MagazineArticle): MagazineGalleryImage[] {
  const images = (input.images ?? [])
    .map((image) => ({
      src: clean(image?.src),
      caption: clean(image?.caption),
      hebrewCaption: clean(image?.hebrewCaption),
      credit: clean(image?.credit) || undefined,
    }))
    .filter((image) => image.src)
  if (images.length) return images
  const cover = clean(input.image)
  return cover ? [{ src: cover, caption: '', hebrewCaption: '' }] : []
}

export function normalizeArticle(input: MagazineArticle): MagazineArticle {
  const body = (input.body ?? []).map((paragraph) => clean(paragraph)).filter(Boolean)
  const images = cleanImages(input)
  const type = input.type === 'video' ? 'video' : 'article'
  const translations: MagazineArticle['translations'] = {}
  for (const locale of LOCALES) {
    const copy = cleanCopy(input.translations?.[locale])
    if (copy) translations[locale] = copy
  }
  return {
    id: clean(input.id),
    slug: clean(input.slug).toLowerCase(),
    type,
    category: clean(input.category),
    title: clean(input.title),
    date: clean(input.date),
    excerpt: clean(input.excerpt),
    image: images.some((item) => item.src === clean(input.image))
      ? clean(input.image)
      : (images[0]?.src ?? clean(input.image)),
    images,
    videoUrl: clean(input.videoUrl) || undefined,
    body,
    isPlaceholder: Boolean(input.isPlaceholder),
    source: cleanSource(input.source),
    hebrew: cleanCopy(input.hebrew),
    translations: Object.keys(translations).length ? translations : undefined,
  }
}

const TRANSLATED_LOCALES = ['he', 'fr', 'ru'] as const

function sampleText(copy: MagazineLocaleCopy): string {
  return [copy.title, copy.excerpt, ...copy.body.slice(0, 3)].join(' ')
}

function inScript(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length
}

/** True when a saved translation is present and actually in that language. */
function localeReady(copy: MagazineLocaleCopy | undefined, locale: 'he' | 'fr' | 'ru'): boolean {
  if (!copy?.title || !copy.body.length) return false
  const sample = sampleText(copy)
  if (locale === 'he') return inScript(sample, /[\u0590-\u05FF]/g) > inScript(sample, /[A-Za-z]/g)
  if (locale === 'ru') return inScript(sample, /[\u0400-\u04FF]/g) > inScript(sample, /[A-Za-z]/g)
  return true
}

function hasWrittenHebrew(copy: MagazineLocaleCopy | undefined): boolean {
  return Boolean(copy && (copy.title || copy.excerpt || copy.body.length))
}

function copyKey(article: MagazineArticle): string {
  return JSON.stringify({
    category: article.category,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    body: article.body,
    source: article.source ?? null,
    captions: (article.images ?? []).map((image) => image.caption).filter(Boolean),
  })
}

function isArticleId(id: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,180}$/.test(id)
}

function isSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

async function database() {
  return getDatabase()
}

export async function ensureArticlesSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedArticlesIfEmpty().catch((error) => {
      seedPromise = null
      throw error
    })
  }
  await seedPromise
}

async function seedArticlesIfEmpty(): Promise<void> {
  const db = await database()
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(742002)')
    const count = await client.query<{ count: number }>('SELECT COUNT(*)::int AS count FROM articles')
    if ((count.rows[0]?.count ?? 0) > 0) {
      await client.query('COMMIT')
      return
    }
    const articles = buildStoredMagazineArticles()
    for (const [index, article] of articles.entries()) {
      await client.query(
        `INSERT INTO articles (id, data, sort_index)
         VALUES ($1, $2::jsonb, $3)
         ON CONFLICT (id) DO NOTHING`,
        [article.id, JSON.stringify(article), index],
      )
    }
    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function listArticles(): Promise<MagazineArticle[]> {
  const db = await database()
  const result = await db.pool.query<{ data: MagazineArticle }>(
    'SELECT data FROM articles ORDER BY sort_index ASC, id ASC',
  )
  return result.rows.map((row) => row.data)
}

export async function upsertArticle(
  input: MagazineArticle,
): Promise<{ article: MagazineArticle; warning?: string }> {
  const article = normalizeArticle(input)
  if (!isArticleId(article.id)) throw new ArticleInputError('A valid article id is required.')
  if (!article.title) throw new ArticleInputError('A title is required.')
  if (!isSlug(article.slug)) {
    throw new ArticleInputError('The link must use lowercase letters, numbers, and hyphens.')
  }
  if (!article.category) throw new ArticleInputError('A category is required.')
  if (!article.date) throw new ArticleInputError('A date is required.')
  if (!article.excerpt) throw new ArticleInputError('A summary is required.')
  if (!article.image) throw new ArticleInputError('An image is required.')
  if (!article.body.length) throw new ArticleInputError('The article needs at least one paragraph.')
  if (article.type === 'video' && !article.videoUrl) {
    throw new ArticleInputError('A video article needs a video link.')
  }

  const db = await database()
  const existing = await db.pool.query<{ data: MagazineArticle }>(
    'SELECT data FROM articles WHERE id = $1',
    [article.id],
  )
  const current = existing.rows[0]?.data
  const duplicate = await db.pool.query<{ id: string }>(
    "SELECT id FROM articles WHERE data->>'slug' = $1 AND id <> $2",
    [article.slug, article.id],
  )
  if (duplicate.rows[0]) throw new ArticleInputError('Another article already uses that link.')

  const copyChanged = !current || copyKey(current) !== copyKey(article)
  const previous = current?.translations
  if (!copyChanged) article.translations = previous ?? article.translations

  const locales = TRANSLATED_LOCALES.filter((locale) => {
    if (locale === 'he' && hasWrittenHebrew(article.hebrew)) return false
    return copyChanged || !localeReady(article.translations?.[locale], locale)
  })
  if (locales.length) {
    const translated = await translateMagazineFields(
      {
        category: article.category,
        title: article.title,
        excerpt: article.excerpt,
        date: article.date,
        body: article.body,
        captions: (article.images ?? []).map((image) => image.caption),
        source: article.source,
      },
      locales,
    )
    const merged: NonNullable<MagazineArticle['translations']> = { ...(article.translations ?? {}) }
    for (const locale of locales) {
      const copy = translated[locale]
      if (copy && localeReady(copy, locale)) merged[locale] = copy
      else if (previous?.[locale]) merged[locale] = previous[locale]
      else delete merged[locale]
    }
    article.translations = Object.keys(merged).length ? merged : undefined
  }

  if (current) {
    await db.pool.query(
      'UPDATE articles SET data = $2::jsonb, updated_at = now() WHERE id = $1',
      [article.id, JSON.stringify(article)],
    )
  } else {
    const first = await db.pool.query<{ sort_index: number }>(
      'SELECT COALESCE(MIN(sort_index), 1) - 1 AS sort_index FROM articles',
    )
    await db.pool.query(
      'INSERT INTO articles (id, data, sort_index) VALUES ($1, $2::jsonb, $3)',
      [article.id, JSON.stringify(article), first.rows[0]?.sort_index ?? 0],
    )
  }
  return { article }
}

export async function deleteArticle(id: string): Promise<boolean> {
  if (!isArticleId(id)) throw new ArticleInputError('A valid article id is required.')
  const db = await database()
  const result = await db.pool.query('DELETE FROM articles WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

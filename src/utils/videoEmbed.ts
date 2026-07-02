/**
 * Convert a public video URL to an embeddable iframe src.
 * Supports YouTube, Vimeo, and direct /embed/ URLs.
 */
export function toVideoEmbedUrl(videoUrl: string): string | null {
  if (!videoUrl) return null

  if (videoUrl.includes('/embed/')) {
    return videoUrl
  }

  try {
    const url = new URL(videoUrl)

    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}` : null
    }
  } catch {
    return null
  }

  return null
}

export function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

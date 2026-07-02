import { isDirectVideoFile, toVideoEmbedUrl } from './videoEmbed'

/** True when a listing has a non-empty video tour URL */
export function hasPropertyVideoTour(videoUrl?: string): boolean {
  return Boolean(videoUrl?.trim())
}

/** True when the URL can be rendered as an embed or native video */
export function isPlayableVideoUrl(videoUrl: string): boolean {
  const trimmed = videoUrl.trim()
  if (!trimmed) return false
  return isDirectVideoFile(trimmed) || Boolean(toVideoEmbedUrl(trimmed))
}

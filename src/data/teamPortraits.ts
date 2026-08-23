export const TEAM_PHOTO_REV = '20260823'

const teamPhotoFiles = {
  'tova-dekkers': '/assets/team/tova-dekkers.jpg',
  'miri-minkin': '/assets/team/miri-minkin.jpg',
  'yana-yatsenko': '/assets/team/yana-yatsenko.png',
  'eden-nahum': '/assets/team/eden-nahum.png',
  'lee-cohen': '/assets/team/lee-cohen.png',
} as const

export type TeamPortraitId = keyof typeof teamPhotoFiles

/** Canonical portrait URL. The revision query avoids stale iPhone / CDN caches. */
export function teamPortrait(id: TeamPortraitId): string {
  return `${teamPhotoFiles[id]}?v=${TEAM_PHOTO_REV}`
}

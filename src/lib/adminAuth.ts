const ADMIN_TOKEN_KEY = 'propertlv_admin_token'

export function setAdminSession(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken())
}

const ADMIN_SESSION_KEY = 'propertlv_admin_session'

const ADMIN_USERNAME = 'Tova'
const ADMIN_PASSWORD = 'TUwBedfvmt(&k3z7b^&Ybp@V'

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function setAdminSession(rememberMe: boolean): void {
  const storage = rememberMe ? localStorage : sessionStorage
  const other = rememberMe ? sessionStorage : localStorage
  other.removeItem(ADMIN_SESSION_KEY)
  storage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ username: ADMIN_USERNAME, at: Date.now() }))
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY)
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function isAdminAuthenticated(): boolean {
  return Boolean(localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(ADMIN_SESSION_KEY))
}

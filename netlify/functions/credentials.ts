const DEFAULT_ADMIN_USERNAME = 'Tova'
const DEFAULT_ADMIN_PASSWORD = 'TUwBedfvmt(&k3z7b^&Ybp@V'

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
}

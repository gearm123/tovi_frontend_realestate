/** A popup lead whose email did not send. Visible in the admin panel only. */
export interface FailedLead {
  id: string
  name: string
  phone: string
  message?: string
  sourcePage: string
  interest: string
  recipientEmail: string
  createdAt: string
}

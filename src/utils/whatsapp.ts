/** Build a WhatsApp deep link for the given phone number and optional pre-filled message. */
export function buildWhatsAppUrl(phoneDigits: string, message?: string): string {
  const base = `https://wa.me/${phoneDigits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

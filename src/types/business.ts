export interface BusinessPhone {
  /** Human-readable display, e.g. 058-6270099 */
  display: string
  /** E.164 for tel: links, e.g. +972586270099 */
  tel: string
  /** Digits only for WhatsApp deep links, e.g. 972586270099 */
  whatsapp: string
}

export interface BusinessAddress {
  /** Full line shown on the site */
  display: string
  line1: string
  city: string
}

export interface BusinessSocial {
  instagram: string
  facebook: string
}

export interface BusinessContact {
  name: string
  contactPerson: string
  phone: BusinessPhone
  email: string
  address: BusinessAddress
  social: BusinessSocial
}

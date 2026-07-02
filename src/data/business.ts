import type { BusinessContact } from '../types/business'
import {
  PLACEHOLDER_ADDRESS,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_SOCIAL,
} from './placeholders'

/**
 * ProperTLV business contact — single source of truth.
 * TODO(client): Update when final contact details are confirmed.
 */
export const business: BusinessContact = {
  name: 'ProperTLV',
  contactPerson: 'Tovi',
  phone: {
    display: '058-6270099',
    tel: '+972586270099',
    whatsapp: '972586270099',
  },
  email: PLACEHOLDER_EMAIL,
  address: {
    display: PLACEHOLDER_ADDRESS,
    line1: PLACEHOLDER_ADDRESS,
    city: 'Tel Aviv',
  },
  social: {
    instagram: PLACEHOLDER_SOCIAL.instagram,
    facebook: PLACEHOLDER_SOCIAL.facebook,
  },
}

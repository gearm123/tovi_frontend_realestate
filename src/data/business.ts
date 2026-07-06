import type { BusinessContact } from '../types/business'
import { PLACEHOLDER_SOCIAL } from './placeholders'

/**
 * ProperTLV business contact — single source of truth.
 */
export const business: BusinessContact = {
  name: 'ProperTLV',
  contactPerson: 'Tovi',
  phone: {
    display: '058-6270099',
    tel: '+972586270099',
    whatsapp: '972586270099',
  },
  email: 'office@propertlv.com',
  address: {
    display: 'בן יהודה 83, תל אביב',
    line1: 'בן יהודה 83',
    city: 'תל אביב',
  },
  social: {
    instagram: PLACEHOLDER_SOCIAL.instagram,
    facebook: PLACEHOLDER_SOCIAL.facebook,
    linkedin: PLACEHOLDER_SOCIAL.linkedin,
  },
  googleBusiness: {
    listingName: 'Proper TLV',
    mapsUrl:
      'https://www.google.com/maps/place/Proper+TLV/data=!4m2!3m1!1s0x0:0x8310b2683aacfe49',
    rating: 5.0,
    reviewCount: 38,
  },
}

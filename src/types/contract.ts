export type ContractStatus = 'pending' | 'signed'

/** Details that change from one lease to the next. The legal clauses stay fixed. */
export interface LeaseDetails {
  propertyStreet: string
  propertyCity: string
  rooms: string
  layout: string
  floor: string
  landlord1Name: string
  landlord1Id: string
  landlord2Name: string
  landlord2Id: string
  landlordNotice: string
  tenant1Name: string
  tenant1Id: string
  tenant1Address: string
  tenant1Phone: string
  tenant1Email: string
  tenant2Name: string
  tenant2Id: string
  tenant2Address: string
  tenant2Phone: string
  tenant2Email: string
  signingCity: string
  signingDate: string
  termMonths: string
  startDate: string
  endDate: string
  rent: string
  rentWords: string
  paymentDay: string
  electricityCap: string
  deposit: string
  depositExtraDays: string
  renewalNoticeDays: string
  earlyExitNoticeDays: string
  lateDailyFee: string
  utilitiesIncluded: boolean
  storageRoom: boolean
  parkingEnabled: boolean
  parkingApartments: string
  parkingSpaces: string
  guarantorName: string
  guarantorId: string
  guarantorAddress: string
  guarantorPhone: string
}

export interface ContractRecord {
  id: string
  token: string
  status: ContractStatus
  details: LeaseDetails
  createdAt: string
  signedAt?: string
  signerName?: string
  pdfUrl?: string
}

export function blankLease(): LeaseDetails {
  return {
    propertyStreet: '',
    propertyCity: 'תל אביב',
    rooms: '3',
    layout: 'מטבח, חדר אמבטיה ושירותים',
    floor: '',
    landlord1Name: '',
    landlord1Id: '',
    landlord2Name: '',
    landlord2Id: '',
    landlordNotice: '',
    tenant1Name: '',
    tenant1Id: '',
    tenant1Address: '',
    tenant1Phone: '',
    tenant1Email: '',
    tenant2Name: '',
    tenant2Id: '',
    tenant2Address: '',
    tenant2Phone: '',
    tenant2Email: '',
    signingCity: 'תל אביב',
    signingDate: '',
    termMonths: '12',
    startDate: '',
    endDate: '',
    rent: '',
    rentWords: '',
    paymentDay: '1',
    electricityCap: '450',
    deposit: '',
    depositExtraDays: '60',
    renewalNoticeDays: '60',
    earlyExitNoticeDays: '90',
    lateDailyFee: '600',
    utilitiesIncluded: true,
    storageRoom: false,
    parkingEnabled: false,
    parkingApartments: '',
    parkingSpaces: '',
    guarantorName: '',
    guarantorId: '',
    guarantorAddress: '',
    guarantorPhone: '',
  }
}

import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { getDatabase } from '@netlify/database'
import { blankLease, type ContractRecord, type ContractStatus, type LeaseDetails } from '../../src/types/contract'
import { adminPassword, adminUsername } from './credentials'
import { buildSignedLeasePdf } from './leasePdf'

const PDF_STORE = 'contract-pdfs'
const TEXT_FIELDS: Array<keyof LeaseDetails> = [
  'propertyStreet',
  'propertyCity',
  'rooms',
  'layout',
  'floor',
  'landlord1Name',
  'landlord1Id',
  'landlord2Name',
  'landlord2Id',
  'landlordNotice',
  'tenant1Name',
  'tenant1Id',
  'tenant1Address',
  'tenant1Phone',
  'tenant1Email',
  'tenant2Name',
  'tenant2Id',
  'tenant2Address',
  'tenant2Phone',
  'tenant2Email',
  'signingCity',
  'signingDate',
  'termMonths',
  'startDate',
  'endDate',
  'rent',
  'rentWords',
  'paymentDay',
  'electricityCap',
  'deposit',
  'depositExtraDays',
  'renewalNoticeDays',
  'earlyExitNoticeDays',
  'lateDailyFee',
  'parkingApartments',
  'parkingSpaces',
  'guarantorName',
  'guarantorId',
  'guarantorAddress',
  'guarantorPhone',
]

interface StoredContract {
  details: LeaseDetails
  signerName?: string
  signedAt?: string
  signerIp?: string
  pdfKey?: string
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function isAdmin(req: Request): boolean {
  const header = req.headers.get('authorization') ?? ''
  const token = header.match(/^Bearer\s+(\S+)$/i)?.[1]
  if (!token) return false
  const splitAt = token.lastIndexOf('.')
  if (splitAt <= 0) return false
  const payload = token.slice(0, splitAt)
  const signature = token.slice(splitAt + 1)
  const expected = createHmac('sha256', adminPassword()).update(payload).digest('base64url')
  if (!safeEqual(signature, expected)) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u?: string
      exp?: number
    }
    return data.u === adminUsername() && typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

function readDetails(value: unknown): LeaseDetails | null {
  if (!value || typeof value !== 'object') return null
  const source = value as Partial<LeaseDetails>
  const details = blankLease()
  for (const key of TEXT_FIELDS) {
    const raw = source[key]
    details[key] = typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim().slice(0, 240) : ''
  }
  details.utilitiesIncluded = source.utilitiesIncluded !== false
  details.storageRoom = source.storageRoom === true
  details.parkingEnabled = source.parkingEnabled === true
  if (!details.landlord1Name || !details.landlord1Id) return null
  if (!details.tenant1Name || !details.tenant1Id) return null
  if (!details.propertyStreet || !details.propertyCity || !details.rent) return null
  if (!details.startDate || !details.endDate) return null
  return details
}

function toRecord(
  id: string,
  token: string,
  status: ContractStatus,
  data: StoredContract,
  createdAt: string,
): ContractRecord {
  return {
    id,
    token,
    status,
    details: data.details,
    createdAt,
    signedAt: data.signedAt,
    signerName: data.signerName,
    pdfUrl: data.pdfKey ? `/api/contract-files/${data.pdfKey}` : undefined,
  }
}

function decodePng(value: string): Buffer | null {
  const match = value.match(/^data:image\/png;base64,([a-zA-Z0-9+/=\s]+)$/)
  if (!match) return null
  const bytes = Buffer.from(match[1].replace(/\s/g, ''), 'base64')
  if (bytes.length < 40 || bytes.length > 1_500_000) return null
  return bytes
}

export async function handleContracts(pathname: string, method: string, req: Request): Promise<Response | null> {
  if (pathname.startsWith('/api/contract-files/') && (method === 'GET' || method === 'HEAD')) {
    return readPdf(pathname.slice('/api/contract-files/'.length), method === 'HEAD')
  }
  if (!pathname.startsWith('/api/contracts')) return null

  if (pathname === '/api/contracts' && method === 'GET') {
    if (!isAdmin(req)) return json(401, { error: 'Sign in again to open contracts.' })
    return listContracts()
  }
  if (pathname === '/api/contracts' && method === 'POST') {
    if (!isAdmin(req)) return json(401, { error: 'Sign in again to open contracts.' })
    return createContract(req)
  }

  const signToken = pathname.startsWith('/api/contracts/sign/')
    ? decodeURIComponent(pathname.slice('/api/contracts/sign/'.length))
    : ''
  if (signToken && method === 'GET') return readForSigning(signToken)
  if (signToken && method === 'POST') return signContract(signToken, req)

  const id = pathname.startsWith('/api/contracts/')
    ? decodeURIComponent(pathname.slice('/api/contracts/'.length))
    : ''
  if (id && !id.includes('/') && method === 'DELETE') {
    if (!isAdmin(req)) return json(401, { error: 'Sign in again to open contracts.' })
    return deleteContract(id)
  }

  return json(404, { error: 'Not found' })
}

async function listContracts(): Promise<Response> {
  const db = await getDatabase()
  const result = await db.pool.query<{
    id: string
    token: string
    status: ContractStatus
    data: StoredContract
    created_at: Date
  }>('SELECT id, token, status, data, created_at FROM contracts ORDER BY created_at DESC')
  return json(200, {
    contracts: result.rows.map((row) =>
      toRecord(row.id, row.token, row.status, row.data, new Date(row.created_at).toISOString()),
    ),
  })
}

async function createContract(req: Request): Promise<Response> {
  const body = (await req.json().catch(() => null)) as { details?: unknown } | null
  const details = readDetails(body?.details)
  if (!details) {
    return json(400, {
      error: 'Street, city, rent, dates, and at least one landlord and one tenant are required.',
    })
  }
  const id = `lease-${Date.now()}`
  const token = randomBytes(24).toString('base64url')
  const data: StoredContract = { details }
  const db = await getDatabase()
  await db.pool.query(
    `INSERT INTO contracts (id, token, status, data)
     VALUES ($1, $2, 'pending', $3::jsonb)`,
    [id, token, JSON.stringify(data)],
  )
  return json(200, { contract: toRecord(id, token, 'pending', data, new Date().toISOString()) })
}

async function readForSigning(token: string): Promise<Response> {
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) return json(404, { error: 'This signing link is not valid.' })
  const db = await getDatabase()
  const result = await db.pool.query<{
    id: string
    token: string
    status: ContractStatus
    data: StoredContract
    created_at: Date
  }>('SELECT id, token, status, data, created_at FROM contracts WHERE token = $1', [token])
  const row = result.rows[0]
  if (!row) return json(404, { error: 'This signing link is not valid.' })
  return json(200, {
    contract: toRecord(row.id, row.token, row.status, row.data, new Date(row.created_at).toISOString()),
  })
}

async function signContract(token: string, req: Request): Promise<Response> {
  if (!/^[A-Za-z0-9_-]{20,80}$/.test(token)) return json(404, { error: 'This signing link is not valid.' })
  const body = (await req.json().catch(() => null)) as { signerName?: string; signature?: string } | null
  const signerName = body?.signerName?.trim().slice(0, 120) ?? ''
  const png = body?.signature ? decodePng(body.signature) : null
  if (!signerName || !png) return json(400, { error: 'A name and a signature are required.' })

  const db = await getDatabase()
  const result = await db.pool.query<{ id: string; status: ContractStatus; data: StoredContract }>(
    'SELECT id, status, data FROM contracts WHERE token = $1',
    [token],
  )
  const row = result.rows[0]
  if (!row) return json(404, { error: 'This signing link is not valid.' })
  if (row.status === 'signed') return json(409, { error: 'This contract is already signed.' })

  const signedAt = new Date()
  const pdf = await buildSignedLeasePdf(row.data.details, png, signerName, signedAt)
  const pdfKey = `${randomUUID()}.pdf`
  const store = getStore(PDF_STORE)
  await store.set(pdfKey, Buffer.from(pdf), { metadata: { contentType: 'application/pdf' } })
  const data: StoredContract = {
    ...row.data,
    signerName,
    signedAt: signedAt.toISOString(),
    signerIp: req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || '',
    pdfKey,
  }
  await db.pool.query(
    `UPDATE contracts
     SET status = 'signed', data = $2::jsonb, updated_at = now()
     WHERE id = $1 AND status = 'pending'`,
    [row.id, JSON.stringify(data)],
  )
  return json(200, {
    contract: toRecord(row.id, token, 'signed', data, signedAt.toISOString()),
  })
}

async function deleteContract(id: string): Promise<Response> {
  if (!/^lease-\d+$/.test(id)) return json(400, { error: 'A valid contract id is required.' })
  const db = await getDatabase()
  const existing = await db.pool.query<{ data: StoredContract }>(
    'SELECT data FROM contracts WHERE id = $1',
    [id],
  )
  const pdfKey = existing.rows[0]?.data.pdfKey
  const result = await db.pool.query('DELETE FROM contracts WHERE id = $1', [id])
  if ((result.rowCount ?? 0) === 0) return json(404, { error: 'Contract not found.' })
  if (pdfKey) {
    await getStore(PDF_STORE).delete(pdfKey).catch(() => undefined)
  }
  return json(200, { ok: true })
}

async function readPdf(key: string, head: boolean): Promise<Response> {
  if (!/^[a-zA-Z0-9-]{36}\.pdf$/.test(key)) return json(404, { error: 'Contract file not found.' })
  const stored = await getStore(PDF_STORE).getWithMetadata(key, { type: 'arrayBuffer' })
  if (!stored?.data) return json(404, { error: 'Contract file not found.' })
  return new Response(head ? null : stored.data, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${key}"`,
      'cache-control': 'private, max-age=3600',
    },
  })
}

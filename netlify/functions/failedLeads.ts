import { randomUUID } from 'node:crypto'
import { getDatabase } from '@netlify/database'
import type { FailedLead } from '../../src/types/failedLead'

const MAX_NAME = 160
const MAX_PHONE = 40
const MAX_MESSAGE = 4000
const MAX_PAGE = 500
const MAX_INTEREST = 200
const MAX_EMAIL = 200

export class FailedLeadInputError extends Error {}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function normalizeLead(input: Partial<FailedLead>, id = randomUUID()): FailedLead {
  const name = clip(input.name, MAX_NAME)
  const phone = clip(input.phone, MAX_PHONE)
  const message = clip(input.message, MAX_MESSAGE)
  const sourcePage = clip(input.sourcePage, MAX_PAGE)
  const interest = clip(input.interest, MAX_INTEREST)
  const recipientEmail = clip(input.recipientEmail, MAX_EMAIL)
  if (!name || !phone) throw new FailedLeadInputError('A name and phone number are required.')
  return {
    id,
    name,
    phone,
    message: message || undefined,
    sourcePage,
    interest,
    recipientEmail,
    createdAt: new Date().toISOString(),
  }
}

async function ensureTable(): Promise<void> {
  const db = await getDatabase()
  await db.pool.query(`
    CREATE TABLE IF NOT EXISTS failed_leads (
      id text PRIMARY KEY,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `)
}

export async function insertFailedLead(input: Partial<FailedLead>): Promise<FailedLead> {
  const lead = normalizeLead(input)
  await ensureTable()
  const db = await getDatabase()
  await db.pool.query(
    'INSERT INTO failed_leads (id, data, created_at) VALUES ($1, $2::jsonb, $3)',
    [lead.id, JSON.stringify(lead), lead.createdAt],
  )
  return lead
}

export async function listFailedLeads(): Promise<FailedLead[]> {
  await ensureTable()
  const db = await getDatabase()
  const result = await db.pool.query<{ data: FailedLead }>(
    'SELECT data FROM failed_leads ORDER BY created_at DESC',
  )
  return result.rows.map((row) => row.data)
}

export async function deleteFailedLead(id: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new FailedLeadInputError('A valid lead id is required.')
  await ensureTable()
  const db = await getDatabase()
  const result = await db.pool.query('DELETE FROM failed_leads WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

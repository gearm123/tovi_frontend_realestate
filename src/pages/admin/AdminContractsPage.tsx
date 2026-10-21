import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { deleteContract, fetchContracts } from '../../services/listingsApi'
import { contractParties, displayDate } from '../../lib/leaseDocument'
import type { ContractRecord } from '../../types/contract'
import './adminShared.css'

function signingLink(token: string): string {
  return `${window.location.origin}/sign/${token}`
}

export default function AdminContractsPage() {
  const location = useLocation()
  const createdLink =
    location.state && typeof location.state === 'object' && 'link' in location.state
      ? String((location.state as { link?: string }).link ?? '')
      : ''
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const load = async () => {
    setError('')
    try {
      setContracts(await fetchContracts())
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load contracts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const copyLink = async (token: string) => {
    const link = signingLink(token)
    await navigator.clipboard.writeText(link)
    setCopied(token)
  }

  const remove = async (contract: ContractRecord) => {
    const ok = window.confirm(
      `Delete the contract for ${contractParties(contract.details)}? This cannot be undone.`,
    )
    if (!ok) return
    setError('')
    try {
      await deleteContract(contract.id)
      setContracts((current) => current.filter((item) => item.id !== contract.id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete that contract.')
    }
  }

  const waiting = contracts.filter((contract) => contract.status === 'pending')
  const signed = contracts.filter((contract) => contract.status === 'signed')

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Contract</h1>
          <p className="admin-page__subtitle">
            Fill a lease, send the signing link, and keep the signed file here.
          </p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn" to="/admin/contracts/new">
            New contract
          </Link>
        </div>
      </header>

      {createdLink ? (
        <p className="admin-notice admin-notice--success">
          Signing link ready: {createdLink}
        </p>
      ) : null}
      {error ? <p className="admin-notice admin-notice--warn">{error}</p> : null}

      <section className="admin-card">
        <h2 className="admin-page__title" style={{ fontSize: '1.05rem' }}>
          Waiting for signature
        </h2>
        {loading ? <p className="admin-empty">Loading contracts…</p> : null}
        {!loading && waiting.length === 0 ? (
          <p className="admin-empty">No contracts are waiting for a signature.</p>
        ) : null}
        {waiting.length > 0 ? (
          <ContractTable
            rows={waiting}
            copied={copied}
            onCopy={copyLink}
            onDelete={remove}
          />
        ) : null}
      </section>

      <section className="admin-card">
        <h2 className="admin-page__title" style={{ fontSize: '1.05rem' }}>
          Signed
        </h2>
        {!loading && signed.length === 0 ? <p className="admin-empty">No signed contracts yet.</p> : null}
        {signed.length > 0 ? (
          <ContractTable rows={signed} copied={copied} onCopy={copyLink} onDelete={remove} />
        ) : null}
      </section>
    </div>
  )
}

function ContractTable({
  rows,
  copied,
  onCopy,
  onDelete,
}: {
  rows: ContractRecord[]
  copied: string
  onCopy: (token: string) => void
  onDelete: (contract: ContractRecord) => void
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Parties</th>
            <th>Rent</th>
            <th>Dates</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((contract) => (
            <tr key={contract.id}>
              <td>
                <strong>{contractParties(contract.details)}</strong>
                <div style={{ color: '#646970', fontSize: 12 }}>
                  {contract.details.propertyCity}
                  {contract.signerName ? ` · Signed by ${contract.signerName}` : ''}
                </div>
              </td>
              <td>{contract.details.rent ? `₪${contract.details.rent}` : '—'}</td>
              <td>
                {displayDate(contract.details.startDate)} – {displayDate(contract.details.endDate)}
              </td>
              <td>
                <div className="admin-table__actions">
                  {contract.status === 'pending' ? (
                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary admin-btn--small"
                      onClick={() => onCopy(contract.token)}
                    >
                      {copied === contract.token ? 'Copied' : 'Copy link'}
                    </button>
                  ) : null}
                  {contract.pdfUrl ? (
                    <a
                      className="admin-btn admin-btn--secondary admin-btn--small"
                      href={contract.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open PDF
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--small"
                    onClick={() => onDelete(contract)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

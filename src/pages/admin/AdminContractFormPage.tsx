import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createContract } from '../../services/listingsApi'
import { blankLease, type LeaseDetails } from '../../types/contract'
import './adminShared.css'

export default function AdminContractFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LeaseDetails>(blankLease)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof LeaseDetails, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const contract = await createContract(form)
      navigate('/admin/contracts', {
        state: { link: `${window.location.origin}/sign/${contract.token}` },
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create this contract.')
      setSaving(false)
    }
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">New contract</h1>
          <p className="admin-page__subtitle">
            Fill the details that change for this lease. The legal text stays the same. The
            customer signs online; landlord signature lines stay on the PDF for a pen signature.
          </p>
        </div>
        <Link className="admin-btn admin-btn--secondary" to="/admin/contracts">
          Back to contracts
        </Link>
      </header>
      {error ? <p className="admin-notice admin-notice--warn">{error}</p> : null}
      <form className="admin-form" onSubmit={handleSubmit}>
        <Section title="Apartment">
          <Text label="Street and number" value={form.propertyStreet} onChange={(value) => set('propertyStreet', value)} />
          <Text label="City" value={form.propertyCity} onChange={(value) => set('propertyCity', value)} />
          <Text label="Rooms" value={form.rooms} onChange={(value) => set('rooms', value)} />
          <Text label="Floor" value={form.floor} onChange={(value) => set('floor', value)} />
          <Text label="Layout" value={form.layout} onChange={(value) => set('layout', value)} wide />
        </Section>
        <Section title="Landlords">
          <Text label="Landlord 1 name" value={form.landlord1Name} onChange={(value) => set('landlord1Name', value)} />
          <Text label="Landlord 1 ID" value={form.landlord1Id} onChange={(value) => set('landlord1Id', value)} />
          <Text label="Landlord 2 name (optional)" value={form.landlord2Name} onChange={(value) => set('landlord2Name', value)} />
          <Text label="Landlord 2 ID" value={form.landlord2Id} onChange={(value) => set('landlord2Id', value)} />
          <Text label="Address or email for notices" value={form.landlordNotice} onChange={(value) => set('landlordNotice', value)} wide />
        </Section>
        <Section title="Tenants">
          <Text label="Tenant 1 name" value={form.tenant1Name} onChange={(value) => set('tenant1Name', value)} />
          <Text label="Tenant 1 ID" value={form.tenant1Id} onChange={(value) => set('tenant1Id', value)} />
          <Text label="Tenant 1 address" value={form.tenant1Address} onChange={(value) => set('tenant1Address', value)} wide />
          <Text label="Tenant 1 phone" value={form.tenant1Phone} onChange={(value) => set('tenant1Phone', value)} />
          <Text label="Tenant 1 email" value={form.tenant1Email} onChange={(value) => set('tenant1Email', value)} />
          <Text label="Tenant 2 name (optional)" value={form.tenant2Name} onChange={(value) => set('tenant2Name', value)} />
          <Text label="Tenant 2 ID" value={form.tenant2Id} onChange={(value) => set('tenant2Id', value)} />
          <Text label="Tenant 2 address" value={form.tenant2Address} onChange={(value) => set('tenant2Address', value)} wide />
          <Text label="Tenant 2 phone" value={form.tenant2Phone} onChange={(value) => set('tenant2Phone', value)} />
          <Text label="Tenant 2 email" value={form.tenant2Email} onChange={(value) => set('tenant2Email', value)} />
        </Section>
        <Section title="Dates and rent">
          <Text label="Signing city" value={form.signingCity} onChange={(value) => set('signingCity', value)} />
          <Text label="Signing date" type="date" value={form.signingDate} onChange={(value) => set('signingDate', value)} />
          <Text label="Length in months" value={form.termMonths} onChange={(value) => set('termMonths', value)} />
          <Text label="Start date" type="date" value={form.startDate} onChange={(value) => set('startDate', value)} />
          <Text label="End date" type="date" value={form.endDate} onChange={(value) => set('endDate', value)} />
          <Text label="Payment day" value={form.paymentDay} onChange={(value) => set('paymentDay', value)} />
          <Text label="Monthly rent" value={form.rent} onChange={(value) => set('rent', value)} />
          <Text label="Rent in Hebrew words" value={form.rentWords} onChange={(value) => set('rentWords', value)} wide />
        </Section>
        <Section title="Amounts">
          <Text label="Electricity included up to (₪)" value={form.electricityCap} onChange={(value) => set('electricityCap', value)} />
          <Text label="Security deposit (₪)" value={form.deposit} onChange={(value) => set('deposit', value)} />
          <Text label="Deposit stays valid (days after the end)" value={form.depositExtraDays} onChange={(value) => set('depositExtraDays', value)} />
          <Text label="Renewal notice (days)" value={form.renewalNoticeDays} onChange={(value) => set('renewalNoticeDays', value)} />
          <Text label="Early exit notice (days)" value={form.earlyExitNoticeDays} onChange={(value) => set('earlyExitNoticeDays', value)} />
          <Text label="Daily amount if the tenant stays past the end" value={form.lateDailyFee} onChange={(value) => set('lateDailyFee', value)} />
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.utilitiesIncluded}
              onChange={(event) => set('utilitiesIncluded', event.target.checked)}
            />
            Rent includes arnona, water, gas, and building fees
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.storageRoom}
              onChange={(event) => set('storageRoom', event.target.checked)}
            />
            Landlords keep a storage room in the apartment
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.parkingEnabled}
              onChange={(event) => set('parkingEnabled', event.target.checked)}
            />
            Mention shared parking with no guaranteed space
          </label>
          {form.parkingEnabled ? (
            <>
              <Text label="Apartments in the building" value={form.parkingApartments} onChange={(value) => set('parkingApartments', value)} />
              <Text label="Parking spaces" value={form.parkingSpaces} onChange={(value) => set('parkingSpaces', value)} />
            </>
          ) : null}
        </Section>
        <Section title="Guarantor (optional)">
          <Text label="Name" value={form.guarantorName} onChange={(value) => set('guarantorName', value)} />
          <Text label="ID" value={form.guarantorId} onChange={(value) => set('guarantorId', value)} />
          <Text label="Address" value={form.guarantorAddress} onChange={(value) => set('guarantorAddress', value)} />
          <Text label="Phone" value={form.guarantorPhone} onChange={(value) => set('guarantorPhone', value)} />
        </Section>
        <div className="admin-form__footer">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? 'Creating link…' : 'Create signing link'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="admin-form__section">
      <h2 className="admin-form__section-title">{title}</h2>
      <div className="admin-form__grid">{children}</div>
    </div>
  )
}

function Text({
  label,
  value,
  onChange,
  type = 'text',
  wide = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'admin-field admin-field--full' : 'admin-field'}>
      <label>
        {label}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  )
}

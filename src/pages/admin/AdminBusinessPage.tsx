import { useEffect, useState, type FormEvent } from 'react'
import { useSiteData } from '../../hooks/useSiteData'
import { updateSiteData } from '../../lib/siteDataStore'
import type { BusinessContact } from '../../types/business'
import './adminShared.css'

export default function AdminBusinessPage() {
  const { business } = useSiteData()
  const [form, setForm] = useState<BusinessContact>(business)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(business)
  }, [business])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateSiteData((data) => ({ ...data, business: form }))
    setSaved(true)
  }

  return (
    <div>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Business settings</h1>
          <p className="admin-page__subtitle">
            Office contact details used across WhatsApp, contact forms, and SEO.
          </p>
        </div>
      </header>

      {saved ? (
        <p className="admin-notice admin-notice--success">Business settings saved.</p>
      ) : null}

      <section className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="biz-name">Business name</label>
              <input
                id="biz-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-person">Contact person</label>
              <input
                id="biz-person"
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-email">Office email</label>
              <input
                id="biz-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-phone-display">Phone display</label>
              <input
                id="biz-phone-display"
                value={form.phone.display}
                onChange={(e) =>
                  setForm({ ...form, phone: { ...form.phone, display: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-phone-tel">Tel (E.164)</label>
              <input
                id="biz-phone-tel"
                value={form.phone.tel}
                onChange={(e) =>
                  setForm({ ...form, phone: { ...form.phone, tel: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-phone-wa">WhatsApp digits</label>
              <input
                id="biz-phone-wa"
                value={form.phone.whatsapp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: { ...form.phone, whatsapp: e.target.value.replace(/\D/g, '') },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-address-display">Address display</label>
              <input
                id="biz-address-display"
                value={form.address.display}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, display: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-address-line1">Street</label>
              <input
                id="biz-address-line1"
                value={form.address.line1}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, line1: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-address-city">City</label>
              <input
                id="biz-address-city"
                value={form.address.city}
                onChange={(e) =>
                  setForm({ ...form, address: { ...form.address, city: e.target.value } })
                }
              />
            </div>
          </div>

          <h2 className="admin-page__title" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
            Social & Google
          </h2>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="biz-ig">Instagram</label>
              <input
                id="biz-ig"
                value={form.social.instagram}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, instagram: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-fb">Facebook</label>
              <input
                id="biz-fb"
                value={form.social.facebook}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, facebook: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-li">LinkedIn</label>
              <input
                id="biz-li"
                value={form.social.linkedin}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-gname">Google listing name</label>
              <input
                id="biz-gname"
                value={form.googleBusiness.listingName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    googleBusiness: { ...form.googleBusiness, listingName: e.target.value },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-gmaps">Google Maps URL</label>
              <input
                id="biz-gmaps"
                value={form.googleBusiness.mapsUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    googleBusiness: { ...form.googleBusiness, mapsUrl: e.target.value },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-rating">Rating</label>
              <input
                id="biz-rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.googleBusiness.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    googleBusiness: {
                      ...form.googleBusiness,
                      rating: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div className="admin-field">
              <label htmlFor="biz-reviews">Review count</label>
              <input
                id="biz-reviews"
                type="number"
                min={0}
                value={form.googleBusiness.reviewCount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    googleBusiness: {
                      ...form.googleBusiness,
                      reviewCount: Number(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="admin-form__footer">
            <button type="submit" className="admin-btn">
              Save business settings
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}


import { useState } from 'react'
import type { FormEvent } from 'react'

type BusinessSettings = {
  businessName: string
  location: string
  email: string
  phone: string
  checkInTime: string
  checkOutTime: string
  description: string
}

const defaultSettings: BusinessSettings = {
  businessName: 'ApartOS Property',
  location: '',
  email: '',
  phone: '',
  checkInTime: '14:00',
  checkOutTime: '11:00',
  description: ''
}

function loadSettings(): BusinessSettings {
  try {
    const saved = localStorage.getItem('apartos-settings')

    if (saved) {
      return {
        ...defaultSettings,
        ...JSON.parse(saved)
      }
    }
  } catch {
    console.error('Could not load settings.')
  }

  return defaultSettings
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function updateSetting(
    field: keyof BusinessSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value
    }))

    setMessage('')
    setError('')
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!settings.businessName.trim()) {
      setError('Business name is required.')
      return
    }

    try {
      localStorage.setItem(
        'apartos-settings',
        JSON.stringify(settings)
      )

      setMessage('Settings saved successfully!')
      setError('')
    } catch {
      setError('Could not save settings.')
      setMessage('')
    }
  }

  function resetSettings() {
    if (!window.confirm('Reset all business settings?')) return

    try {
      localStorage.removeItem('apartos-settings')
      setSettings({ ...defaultSettings })
      setMessage('Settings reset successfully.')
      setError('')
    } catch {
      setError('Could not reset settings.')
      setMessage('')
    }
  }

  return (
    <div className="settings-page">
      <h1>Business Settings</h1>

      <p>Manage your property and business preferences.</p>

      <form onSubmit={saveSettings}>
        <section className="apartment-form-section">
          <h2>Business Information</h2>

          <div className="apartment-form">
            <label>
              Business Name
              <input
                type="text"
                value={settings.businessName}
                onChange={(event) =>
                  updateSetting('businessName', event.target.value)
                }
                required
              />
            </label>

            <label>
              Location
              <input
                type="text"
                placeholder="Demre, Antalya"
                value={settings.location}
                onChange={(event) =>
                  updateSetting('location', event.target.value)
                }
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                placeholder="info@example.com"
                value={settings.email}
                onChange={(event) =>
                  updateSetting('email', event.target.value)
                }
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                value={settings.phone}
                onChange={(event) =>
                  updateSetting('phone', event.target.value)
                }
              />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              Business Description

              <textarea
                rows={5}
                placeholder="Describe your business..."
                value={settings.description}
                onChange={(event) =>
                  updateSetting('description', event.target.value)
                }
                style={{
                  width: '100%',
                  padding: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  font: 'inherit',
                  resize: 'vertical'
                }}
              />
            </label>
          </div>
        </section>

        <section className="apartment-form-section">
          <h2>Reservation Preferences</h2>

          <div className="apartment-form">
            <label>
              Default Check-in Time
              <input
                type="time"
                value={settings.checkInTime}
                onChange={(event) =>
                  updateSetting('checkInTime', event.target.value)
                }
                required
              />
            </label>

            <label>
              Default Check-out Time
              <input
                type="time"
                value={settings.checkOutTime}
                onChange={(event) =>
                  updateSetting('checkOutTime', event.target.value)
                }
                required
              />
            </label>

            <label>
              Currency
              <input
                type="text"
                value="TRY (₺)"
                readOnly
              />
            </label>
          </div>
        </section>

        <div
          className="apartment-form"
          style={{ marginTop: '25px' }}
        >
          <button type="submit">
            Save Settings
          </button>

          <button
            type="button"
            onClick={resetSettings}
            style={{
              background: '#fee2e2',
              color: '#b91c1c'
            }}
          >
            Reset Settings
          </button>
        </div>

        {message && (
          <p role="status" style={{ color: '#15803d' }}>
            {message}
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: '#dc2626' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default Settings

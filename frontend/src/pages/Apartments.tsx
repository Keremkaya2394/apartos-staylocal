
import { useEffect, useState } from 'react'

type Apartment = {
  id: number
  name: string
  location: string
  price: number
  capacity: number
}

const initialApartments: Apartment[] = [
  {
    id: 1,
    name: 'Sea View Apartment',
    location: 'Demre, Antalya',
    price: 2500,
    capacity: 4
  },
  {
    id: 2,
    name: 'Garden Suite',
    location: 'Kaş, Antalya',
    price: 3200,
    capacity: 3
  }
]

function Apartments() {
  const [apartments, setApartments] = useState<Apartment[]>(() => {
    try {
      const saved = localStorage.getItem('apartos-apartments')

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved)

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) =>
              item !== null &&
              typeof item === 'object' &&
              typeof item.id === 'number' &&
              typeof item.name === 'string' &&
              typeof item.location === 'string' &&
              typeof item.price === 'number' &&
              typeof item.capacity === 'number'
          )
        ) {
          return parsed as Apartment[]
        }
      }
    } catch {
      console.log('Could not load saved apartments.')
    }

    return initialApartments
  })

  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')

  useEffect(() => {
    localStorage.setItem(
      'apartos-apartments',
      JSON.stringify(apartments)
    )
  }, [apartments])

  function resetForm() {
    setEditingId(null)
    setName('')
    setLocation('')
    setPrice('')
    setCapacity('')
  }

  function saveApartment(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const numericPrice = Number(price)
    const numericCapacity = Number(capacity)

    if (!name.trim() || !location.trim()) return

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return

    if (
      !Number.isInteger(numericCapacity) ||
      numericCapacity <= 0
    ) return

    if (editingId !== null) {
      setApartments((current) =>
        current.map((apartment) =>
          apartment.id === editingId
            ? {
                ...apartment,
                name: name.trim(),
                location: location.trim(),
                price: numericPrice,
                capacity: numericCapacity
              }
            : apartment
        )
      )
    } else {
      const newApartment: Apartment = {
        id: Math.max(Date.now(), ...apartments.map((a) => a.id + 1)),
        name: name.trim(),
        location: location.trim(),
        price: numericPrice,
        capacity: numericCapacity
      }

      setApartments((current) => [...current, newApartment])
    }

    resetForm()
  }

  function editApartment(apartment: Apartment) {
    setEditingId(apartment.id)
    setName(apartment.name)
    setLocation(apartment.location)
    setPrice(String(apartment.price))
    setCapacity(String(apartment.capacity))

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteApartment(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this apartment?'
    )

    if (!confirmed) return

    setApartments((current) =>
      current.filter((apartment) => apartment.id !== id)
    )

    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="apartments-page">
      <h1>Apartment Management</h1>
      <p>Add, edit and manage your apartments.</p>

      <section className="apartment-form-section">
        <h2>
          {editingId !== null
            ? 'Edit Apartment'
            : 'Add New Apartment'}
        </h2>

        <form className="apartment-form" onSubmit={saveApartment}>
          <input
            type="text"
            placeholder="Apartment name"
            aria-label="Apartment name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Location"
            aria-label="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Nightly price (TRY)"
            aria-label="Nightly price (TRY)"
            value={price}
            min="1"
            onChange={(event) => setPrice(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Guest capacity"
            aria-label="Guest capacity"
            value={capacity}
            min="1"
            step="1"
            onChange={(event) => setCapacity(event.target.value)}
            required
          />

          <button type="submit">
            {editingId !== null
              ? 'Save Changes'
              : 'Add Apartment'}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="delete-button"
              onClick={resetForm}
            >
              Cancel Editing
            </button>
          )}
        </form>
      </section>

      <section className="apartment-list-section">
        <h2>My Apartments ({apartments.length})</h2>

        {apartments.length === 0 && (
          <p>No apartments found. Add your first apartment.</p>
        )}

        <div className="apartment-grid">
          {apartments.map((apartment) => (
            <article className="apartment-card" key={apartment.id}>
              <h3>{apartment.name}</h3>

              <p>📍 {apartment.location}</p>

              <p>
                👥 Capacity: {apartment.capacity} guests
              </p>

              <p>
                💰 {apartment.price.toLocaleString('tr-TR')} ₺ / night
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  marginTop: '20px'
                }}
              >
                <button
                  type="button"
                  onClick={() => editApartment(apartment)}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteApartment(apartment.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Apartments

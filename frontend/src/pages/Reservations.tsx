
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Apartment = {
  id: number
  name: string
}

type Reservation = {
  id: string
  apartmentId: number
  guestName: string
  checkIn: string
  checkOut: string
  status: 'Confirmed' | 'Cancelled'
}

const defaultApartments: Apartment[] = [
  { id: 1, name: 'Sea View Apartment' },
  { id: 2, name: 'Garden Suite' }
]

function loadApartments(): Apartment[] {
  try {
    const saved = localStorage.getItem('apartos-apartments')

    if (saved === null) return defaultApartments

    const data: unknown = JSON.parse(saved)

    if (!Array.isArray(data)) return []

    return data.filter(
      (item): item is Apartment =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'number' &&
        typeof item.name === 'string'
    )
  } catch {
    return []
  }
}

function loadReservations(): Reservation[] {
  try {
    const saved = localStorage.getItem('apartos-reservations')

    if (saved === null) return []

    const data: unknown = JSON.parse(saved)

    if (!Array.isArray(data)) return []

    return data.filter(
      (item): item is Reservation =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.apartmentId === 'number' &&
        typeof item.guestName === 'string' &&
        typeof item.checkIn === 'string' &&
        typeof item.checkOut === 'string' &&
        ['Confirmed', 'Cancelled'].includes(item.status)
    )
  } catch {
    return []
  }
}

function Reservations() {
  const [apartments] = useState(loadApartments)
  const [reservations, setReservations] = useState(loadReservations)

  const [apartmentId, setApartmentId] = useState('')
  const [guestName, setGuestName] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem(
      'apartos-reservations',
      JSON.stringify(reservations)
    )
  }, [reservations])

  function addReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setMessage('')

    const selectedId = Number(apartmentId)

    if (!apartments.some((apartment) => apartment.id === selectedId)) {
      setError('Please select a valid apartment.')
      return
    }

    if (!guestName.trim() || !checkIn || !checkOut) {
      setError('Please complete all fields.')
      return
    }

    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.')
      return
    }

    const hasConflict = reservations.some((reservation) => {
      if (reservation.status === 'Cancelled') return false
      if (reservation.apartmentId !== selectedId) return false

      return (
        checkIn < reservation.checkOut &&
        checkOut > reservation.checkIn
      )
    })

    if (hasConflict) {
      setError(
        'This apartment is already reserved for the selected dates.'
      )
      return
    }

    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      apartmentId: selectedId,
      guestName: guestName.trim(),
      checkIn,
      checkOut,
      status: 'Confirmed'
    }

    setReservations((current) => [...current, newReservation])

    setApartmentId('')
    setGuestName('')
    setCheckIn('')
    setCheckOut('')
    setMessage('Reservation created successfully!')
  }

  function cancelReservation(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this reservation?'
    )

    if (!confirmed) return

    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: 'Cancelled' }
          : reservation
      )
    )

    setMessage('Reservation cancelled.')
    setError('')
  }

  function getApartmentName(id: number) {
    return apartments.find((apartment) => apartment.id === id)?.name
      ?? 'Deleted apartment'
  }

  return (
    <div className="reservations-page">
      <h1>Reservation Management</h1>
      <p>Create and manage apartment reservations.</p>

      <section className="apartment-form-section">
        <h2>New Reservation</h2>

        <form className="apartment-form" onSubmit={addReservation}>
          <select
            value={apartmentId}
            onChange={(event) => setApartmentId(event.target.value)}
            required
          >
            <option value="">Select Apartment</option>
            {apartments.map((apartment) => (
              <option key={apartment.id} value={apartment.id}>
                {apartment.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Guest Full Name"
            aria-label="Guest full name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            required
          />

          <label>
            Check-in Date
            <input
              type="date"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              required
            />
          </label>

          <label>
            Check-out Date
            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(event) => setCheckOut(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={apartments.length === 0}>
            Create Reservation
          </button>
        </form>

        {error && (
          <p role="alert" style={{ color: '#dc2626' }}>{error}</p>
        )}

        {message && (
          <p role="status" style={{ color: '#15803d' }}>{message}</p>
        )}
      </section>

      <section className="reservation-section">
        <div className="section-heading">
          <h2>All Reservations ({reservations.length})</h2>
        </div>

        <div className="table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Apartment</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.guestName}</td>
                  <td>{getApartmentName(reservation.apartmentId)}</td>
                  <td>{reservation.checkIn}</td>
                  <td>{reservation.checkOut}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        reservation.status.toLowerCase()
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    {reservation.status === 'Confirmed' && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => cancelReservation(reservation.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reservations.length === 0 && (
            <p>No reservations yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Reservations

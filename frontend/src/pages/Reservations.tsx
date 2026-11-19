
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Apartment = {
  id: number
  name: string
  price: number
}

type Reservation = {
  id: string
  apartmentId: number
  guestName: string
  checkIn: string
  checkOut: string
  status: 'Confirmed' | 'Cancelled'
  nightlyPrice?: number
  totalPrice?: number
}

function loadData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

function getNights(checkIn: string, checkOut: string) {
  return Math.round(
    (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000
  )
}

function Reservations() {
  const [apartments] = useState(() =>
    loadData<Apartment[]>('apartos-apartments', [
      { id: 1, name: 'Sea View Apartment', price: 2500 },
      { id: 2, name: 'Garden Suite', price: 3200 }
    ])
  )

  const [reservations, setReservations] = useState(() =>
    loadData<Reservation[]>('apartos-reservations', [])
  )

  const [apartmentId, setApartmentId] = useState('')
  const [guestName, setGuestName] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedApartment = apartments.find(
    (apartment) => apartment.id === Number(apartmentId)
  )

  const nights = checkIn && checkOut
    ? Math.max(0, getNights(checkIn, checkOut))
    : 0

  const totalPrice = nights * (selectedApartment?.price ?? 0)

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

    if (!selectedApartment) {
      setError('Please select an apartment.')
      return
    }

    if (!guestName.trim() || !checkIn || !checkOut) {
      setError('Please complete all fields.')
      return
    }

    if (!Number.isFinite(nights) || nights <= 0) {
      setError('Check-out must be after check-in.')
      return
    }

    if (
      !Number.isFinite(selectedApartment.price) ||
      selectedApartment.price <= 0
    ) {
      setError('Invalid apartment price.')
      return
    }

    const hasConflict = reservations.some(
      (reservation) =>
        reservation.status === 'Confirmed' &&
        reservation.apartmentId === selectedApartment.id &&
        checkIn < reservation.checkOut &&
        checkOut > reservation.checkIn
    )

    if (hasConflict) {
      setError('This apartment is already reserved for these dates.')
      return
    }

    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      apartmentId: selectedApartment.id,
      guestName: guestName.trim(),
      checkIn,
      checkOut,
      status: 'Confirmed',
      nightlyPrice: selectedApartment.price,
      totalPrice: totalPrice
    }

    setReservations((current) => [...current, newReservation])

    setApartmentId('')
    setGuestName('')
    setCheckIn('')
    setCheckOut('')
    setMessage('Reservation created successfully!')
  }

  function cancelReservation(id: string) {
    if (!window.confirm('Cancel this reservation?')) return

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
    return apartments.find((item) => item.id === id)?.name
      ?? 'Deleted Apartment'
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
            aria-label="Select apartment"
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

          {selectedApartment && (
            <div className="stat-card">
              <p>
                Nightly Price: {selectedApartment.price.toLocaleString('tr-TR')} ₺
              </p>
              <p>Total Nights: {nights}</p>
              <strong>
                {totalPrice.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
          )}

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
                <th>Nights</th>
                <th>Total Price</th>
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
                    {getNights(reservation.checkIn, reservation.checkOut)}
                  </td>
                  <td>
                    {reservation.totalPrice !== undefined
                      ? `${reservation.totalPrice.toLocaleString('tr-TR')} ₺`
                      : 'Not recorded'}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${reservation.status.toLowerCase()}`}
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

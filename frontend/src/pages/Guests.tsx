
import { useState } from 'react'
import StatCard from '../components/StatCard'

type Reservation = {
  id: string
  apartmentId: number
  guestName: string
  checkIn: string
  checkOut: string
  totalPrice?: number
  status: 'Confirmed' | 'Cancelled'
}

type Guest = {
  name: string
  reservations: Reservation[]
}

function loadReservations(): Reservation[] {
  try {
    const saved = localStorage.getItem('apartos-reservations')
    const data = saved ? JSON.parse(saved) : []

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function Guests() {
  const [reservations] = useState(loadReservations)
  const [search, setSearch] = useState('')
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null)

  const guestMap = new Map<string, Guest>()

  reservations.forEach((reservation) => {
    const key = reservation.guestName.trim().toLocaleLowerCase('tr-TR')

    const existingGuest = guestMap.get(key)

    if (existingGuest) {
      existingGuest.reservations.push(reservation)
    } else {
      guestMap.set(key, {
        name: reservation.guestName,
        reservations: [reservation]
      })
    }
  })

  const guests = Array.from(guestMap.values())

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLocaleLowerCase('tr-TR').includes(
      search.trim().toLocaleLowerCase('tr-TR')
    )
  )

  const confirmedGuests = guests.filter((guest) =>
    guest.reservations.some(
      (reservation) => reservation.status === 'Confirmed'
    )
  ).length

  const returningGuests = guests.filter((guest) =>
    guest.reservations.filter(
      (reservation) => reservation.status === 'Confirmed'
    ).length > 1
  ).length

  function getTotalSpent(guest: Guest) {
    return guest.reservations
      .filter((reservation) => reservation.status === 'Confirmed')
      .reduce(
        (total, reservation) => total + (reservation.totalPrice ?? 0),
        0
      )
  }

  return (
    <div className="guests-page">
      <h1>Guest Management</h1>
      <p>View your guests and their reservation history.</p>

      <div className="stats">
        <StatCard
          title="Total Guests"
          value={guests.length}
          icon="👥"
        />

        <StatCard
          title="Confirmed Guests"
          value={confirmedGuests}
          icon="✅"
        />

        <StatCard
          title="Returning Guests"
          value={returningGuests}
          icon="🔄"
        />

        <StatCard
          title="Total Reservations"
          value={reservations.length}
          icon="📅"
        />
      </div>

      <section className="apartment-form-section">
        <h2>Search Guests</h2>

        <div className="apartment-form">
          <input
            type="text"
            placeholder="Search by guest name..."
            aria-label="Search by guest name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>

      <section className="reservation-section">
        <div className="section-heading">
          <h2>All Guests ({filteredGuests.length})</h2>
        </div>

        <div className="table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Reservations</th>
                <th>Confirmed</th>
                <th>Cancelled</th>
                <th>Booking Value</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.name}>
                  <td>{guest.name}</td>

                  <td>{guest.reservations.length}</td>

                  <td>
                    {guest.reservations.filter(
                      (item) => item.status === 'Confirmed'
                    ).length}
                  </td>

                  <td>
                    {guest.reservations.filter(
                      (item) => item.status === 'Cancelled'
                    ).length}
                  </td>

                  <td>
                    {getTotalSpent(guest).toLocaleString('tr-TR')} ₺
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedGuest(
                        selectedGuest === guest.name
                          ? null
                          : guest.name
                      )}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedGuest === guest.name
                        ? 'Close'
                        : 'View History'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGuests.length === 0 && (
            <p>No guests found.</p>
          )}
        </div>
      </section>

      {selectedGuest && (
        <section className="reservation-section">
          <div className="section-heading">
            <h2>{selectedGuest} — Reservation History</h2>
          </div>

          <div className="table-wrapper">
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {guests
                  .find((guest) => guest.name === selectedGuest)
                  ?.reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.checkIn}</td>
                      <td>{reservation.checkOut}</td>

                      <td>
                        {reservation.totalPrice !== undefined
                          ? `${reservation.totalPrice.toLocaleString('tr-TR')} ₺`
                          : 'Not recorded'}
                      </td>

                      <td>
                        <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default Guests

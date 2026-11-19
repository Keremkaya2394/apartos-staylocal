
import { useState } from 'react'
import StatCard from '../components/StatCard'

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
  totalPrice?: number
  status: 'Confirmed' | 'Cancelled'
}

function loadData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

function formatMoney(value: number) {
  return `${value.toLocaleString('tr-TR', {
    maximumFractionDigits: 2
  })} ₺`
}

function Revenue() {
  const [apartments] = useState(() =>
    loadData<Apartment[]>('apartos-apartments', [
      { id: 1, name: 'Sea View Apartment' },
      { id: 2, name: 'Garden Suite' }
    ])
  )

  const [reservations] = useState(() =>
    loadData<Reservation[]>('apartos-reservations', [])
  )

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  )

  const confirmed = reservations.filter(
    (reservation) => reservation.status === 'Confirmed'
  )

  const priced = confirmed.filter(
    (reservation) =>
      typeof reservation.totalPrice === 'number' &&
      Number.isFinite(reservation.totalPrice)
  )

  const totalRevenue = priced.reduce(
    (total, reservation) => total + (reservation.totalPrice ?? 0),
    0
  )

  const now = new Date()

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}`

  const monthlyRevenue = priced
    .filter((reservation) =>
      reservation.checkIn.startsWith(currentMonth)
    )
    .reduce(
      (total, reservation) => total + (reservation.totalPrice ?? 0),
      0
    )

  const averageRevenue = priced.length > 0
    ? totalRevenue / priced.length
    : 0

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const monthlyData = months.map((month, index) => {
    const monthKey = `${selectedYear}-${String(index + 1).padStart(2, '0')}`

    const amount = priced
      .filter((reservation) =>
        reservation.checkIn.startsWith(monthKey)
      )
      .reduce(
        (total, reservation) => total + (reservation.totalPrice ?? 0),
        0
      )

    return { month, amount }
  })

  const maxRevenue = Math.max(
    1,
    ...monthlyData.map((item) => item.amount)
  )

  const apartmentIds = [
    ...new Set([
      ...apartments.map((item) => item.id),
      ...priced.map((item) => item.apartmentId)
    ])
  ]

  const apartmentRevenue = apartmentIds.map((id) => {
    const apartmentReservations = priced.filter(
      (reservation) => reservation.apartmentId === id
    )

    return {
      id,
      name: apartments.find((item) => item.id === id)?.name
        ?? `Deleted Apartment (${id})`,
      count: apartmentReservations.length,
      revenue: apartmentReservations.reduce(
        (total, reservation) =>
          total + (reservation.totalPrice ?? 0),
        0
      )
    }
  }).sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="revenue-page">
      <h1>Revenue Overview</h1>
      <p>Track your property booking value and performance.</p>

      <div className="stats">
        <StatCard
          title="Total Booking Value"
          value={formatMoney(totalRevenue)}
          icon="💰"
        />

        <StatCard
          title="This Month"
          value={formatMoney(monthlyRevenue)}
          icon="📅"
        />

        <StatCard
          title="Confirmed Reservations"
          value={confirmed.length}
          icon="✅"
        />

        <StatCard
          title="Average Booking Value"
          value={formatMoney(averageRevenue)}
          icon="📊"
        />
      </div>

      {confirmed.length > priced.length && (
        <p style={{ color: '#92400e' }}>
          {confirmed.length - priced.length} older reservation(s)
          have no recorded price and are excluded from revenue totals.
        </p>
      )}

      <section className="reservation-section">
        <div className="section-heading">
          <h2>Monthly Booking Value</h2>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <button
            type="button"
            onClick={() => setSelectedYear((year) => year - 1)}
          >
            ←
          </button>

          <strong>{selectedYear}</strong>

          <button
            type="button"
            onClick={() => setSelectedYear((year) => year + 1)}
          >
            →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            minWidth: '550px',
            height: '250px',
            padding: '10px'
          }}>
            {monthlyData.map((item) => (
              <div
                key={item.month}
                title={`${item.month}: ${formatMoney(item.amount)}`}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '10px' }}>
                  {item.amount.toLocaleString('tr-TR')}
                </span>

                <div style={{
                  height: `${(item.amount / maxRevenue) * 75}%`,
                  minHeight: item.amount > 0 ? '4px' : '0',
                  width: '100%',
                  background: '#2563eb',
                  borderRadius: '6px 6px 0 0'
                }} />

                <span style={{
                  color: '#64748b',
                  fontSize: '12px'
                }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p>Booking values grouped by check-in month.</p>
      </section>

      <section className="reservation-section">
        <div className="section-heading">
          <h2>Revenue by Apartment</h2>
        </div>

        <div className="table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Apartment</th>
                <th>Priced Reservations</th>
                <th>Total Booking Value</th>
              </tr>
            </thead>

            <tbody>
              {apartmentRevenue.map((apartment) => (
                <tr key={apartment.id}>
                  <td>{apartment.name}</td>
                  <td>{apartment.count}</td>
                  <td>{formatMoney(apartment.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Revenue


type Reservation = {
  id: number
  guest: string
  apartment: string
  checkIn: string
  checkOut: string
  amount: number
  status: 'Confirmed' | 'Pending' | 'Cancelled'
}

const reservations: Reservation[] = [
  {
    id: 1,
    guest: 'Ahmet Yılmaz',
    apartment: 'Apartment 3',
    checkIn: '2026-11-18',
    checkOut: '2026-11-22',
    amount: 8400,
    status: 'Confirmed'
  },
  {
    id: 2,
    guest: 'Sarah Miller',
    apartment: 'Apartment 7',
    checkIn: '2026-11-20',
    checkOut: '2026-11-25',
    amount: 12500,
    status: 'Pending'
  },
  {
    id: 3,
    guest: 'Mehmet Demir',
    apartment: 'Apartment 2',
    checkIn: '2026-11-23',
    checkOut: '2026-11-27',
    amount: 7600,
    status: 'Confirmed'
  }
]

function ReservationTable() {
  return (
    <section className="reservation-section">
      <div className="section-heading">
        <h2>Recent Reservations</h2>
        <span>Sample reservations</span>
      </div>

      <div className="table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Apartment</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.guest}</td>
                <td>{reservation.apartment}</td>
                <td>{reservation.checkIn}</td>
                <td>{reservation.checkOut}</td>
                <td>
                  {reservation.amount.toLocaleString('tr-TR')} ₺
                </td>
                <td>
                  <span
                    className={`status-badge ${reservation.status.toLowerCase()}`}
                  >
                    {reservation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ReservationTable


export type Reservation = {
  id: string
  apartmentId: number
  guestName: string
  checkIn: string
  checkOut: string
  status: 'Confirmed' | 'Cancelled'
}

type Apartment = {
  id: number
  name: string
}

type ReservationTableProps = {
  reservations: Reservation[]
  apartments: Apartment[]
}

function ReservationTable({
  reservations,
  apartments
}: ReservationTableProps) {

  function getApartmentName(id: number) {
    const apartment = apartments.find(
      (item) => item.id === id
    )

    return apartment?.name ?? 'Deleted Apartment'
  }

  const recentReservations = [...reservations]
    .sort((a, b) => b.checkIn.localeCompare(a.checkIn))
    .slice(0, 5)

  return (
    <section className="reservation-section">
      <div className="section-heading">
        <h2>Recent Reservations</h2>
        <span>Latest reservation records</span>
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
            </tr>
          </thead>

          <tbody>
            {recentReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.guestName}</td>

                <td>
                  {getApartmentName(reservation.apartmentId)}
                </td>

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
              </tr>
            ))}
          </tbody>
        </table>

        {recentReservations.length === 0 && (
          <p>No reservations yet.</p>
        )}
      </div>
    </section>
  )
}

export default ReservationTable

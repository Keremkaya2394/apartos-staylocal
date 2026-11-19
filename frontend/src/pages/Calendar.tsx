
import { useState } from 'react'

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

function loadData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

function Calendar() {
  const [apartments] = useState(() =>
    loadData<Apartment[]>('apartos-apartments', [
      { id: 1, name: 'Sea View Apartment' },
      { id: 2, name: 'Garden Suite' }
    ])
  )

  const [reservations] = useState(() =>
    loadData<Reservation[]>('apartos-reservations', [])
  )

  const [selectedApartment, setSelectedApartment] = useState(
    apartments[0]?.id.toString() ?? ''
  )

  const [currentDate, setCurrentDate] = useState(
    new Date()
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = (
    new Date(year, month, 1).getDay() + 6
  ) % 7

  const daysInMonth = new Date(
    year, month + 1, 0
  ).getDate()

  const totalCells = Math.ceil(
    (firstDay + daysInMonth) / 7
  ) * 7

  const weekDays = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ]

  function changeMonth(direction: number) {
    setCurrentDate(
      new Date(year, month + direction, 1)
    )
  }

  function getDateString(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function getReservation(day: number) {
    const date = getDateString(day)

    return reservations.find(
      (reservation) =>
        reservation.apartmentId === Number(selectedApartment) &&
        reservation.status === 'Confirmed' &&
        date >= reservation.checkIn &&
        date < reservation.checkOut
    )
  }

  const reservedDays = Array.from(
    { length: daysInMonth },
    (_, index) => index + 1
  ).filter((day) => getReservation(day)).length

  const availableDays = daysInMonth - reservedDays

  const occupancyRate = Math.round(
    (reservedDays / daysInMonth) * 100
  )

  return (
    <div>
      <h1>Availability Calendar</h1>
      <p>Track apartment availability and occupancy.</p>

      <section className="apartment-form-section">
        <div className="apartment-form">
          <label>
            Select Apartment
            <select
              value={selectedApartment}
              onChange={(event) =>
                setSelectedApartment(event.target.value)
              }
            >
              {apartments.length === 0 && (
                <option value="">No apartments available</option>
              )}

              {apartments.map((apartment) => (
                <option
                  key={apartment.id}
                  value={apartment.id}
                >
                  {apartment.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {apartments.length > 0 ? (
        <>
          <div className="stats">
            <div className="stat-card">
              <h3>Available Days</h3>
              <strong>{availableDays}</strong>
            </div>

            <div className="stat-card">
              <h3>Reserved Days</h3>
              <strong>{reservedDays}</strong>
            </div>

            <div className="stat-card">
              <h3>Occupancy Rate</h3>
              <strong>{occupancyRate}%</strong>
            </div>
          </div>

          <section
            className="apartment-list-section"
            style={{ marginBottom: '30px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '25px'
              }}
            >
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                style={navigationButton}
              >
                ←
              </button>

              <h2 style={{ margin: 0, textAlign: 'center' }}>
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                style={navigationButton}
              >
                →
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: '6px'
              }}
            >
              {weekDays.map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {day}
                </div>
              ))}

              {Array.from(
                { length: totalCells },
                (_, index) => {
                  const day = index - firstDay + 1

                  if (day < 1 || day > daysInMonth) {
                    return <div key={index} />
                  }

                  const reservation = getReservation(day)

                  return (
                    <div
                      key={index}
                      title={
                        reservation
                          ? reservation.guestName
                          : 'Available'
                      }
                      style={{
                        minHeight: '75px',
                        padding: '8px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: reservation
                          ? '#fee2e2'
                          : '#dcfce7',
                        color: reservation
                          ? '#991b1b'
                          : '#166534'
                      }}
                    >
                      <strong>{day}</strong>

                      {reservation && (
                        <div
                          style={{
                            fontSize: '11px',
                            marginTop: '6px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {reservation.guestName}
                        </div>
                      )}
                    </div>
                  )
                }
              )}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginTop: '25px',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ color: '#166534' }}>
                🟩 Available
              </span>

              <span style={{ color: '#991b1b' }}>
                🟥 Reserved
              </span>
            </div>
          </section>
        </>
      ) : (
        <p>Add an apartment to use the calendar.</p>
      )}
    </div>
  )
}

const navigationButton = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 18px',
  cursor: 'pointer'
}

export default Calendar

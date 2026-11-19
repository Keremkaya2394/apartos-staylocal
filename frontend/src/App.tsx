
import { useState } from 'react'

import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import ReservationTable from './components/ReservationTable'
import type { Reservation } from './components/ReservationTable'

import Apartments from './pages/Apartments'
import Reservations from './pages/Reservations'
import Calendar from './pages/Calendar'

import './App.css'

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

function getApartments(): Apartment[] {
  try {
    const saved = localStorage.getItem('apartos-apartments')

    if (saved === null) return initialApartments

    const data: unknown = JSON.parse(saved)

    if (
      Array.isArray(data) &&
      data.every(
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
      return data as Apartment[]
    }
  } catch {
    console.error('Could not load apartments.')
  }

  return []
}

function getReservations(): Reservation[] {
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
        (item.status === 'Confirmed' ||
          item.status === 'Cancelled')
    )
  } catch {
    console.error('Could not load reservations.')
  }

  return []
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [apartments, setApartments] =
    useState<Apartment[]>(getApartments)

  const [reservations, setReservations] =
    useState<Reservation[]>(getReservations)

  function changePage(page: string) {
    setApartments(getApartments())
    setReservations(getReservations())
    setActivePage(page)
  }

  const totalApartments = apartments.length

  const now = new Date()

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')

  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.status === 'Confirmed' &&
      reservation.checkOut > today
  ).length

  const totalCapacity = apartments.reduce(
    (total, apartment) => total + apartment.capacity,
    0
  )

  const averagePrice =
    totalApartments > 0
      ? apartments.reduce(
          (total, apartment) => total + apartment.price,
          0
        ) / totalApartments
      : 0

  return (
    <div className="dashboard-layout">
      <Sidebar
        activePage={activePage}
        onPageChange={changePage}
      />

      <main className="dashboard-content">
        {activePage === 'Dashboard' && (
          <>
            <h1>Dashboard Overview</h1>
            <p>Welcome to ApartOS Property Management.</p>

            <div className="stats">
              <StatCard
                title="Total Apartments"
                value={totalApartments}
                icon="🏠"
              />

              <StatCard
                title="Active Reservations"
                value={activeReservations}
                icon="📅"
              />

              <StatCard
                title="Total Guest Capacity"
                value={totalCapacity}
                icon="👥"
              />

              <StatCard
                title="Average Nightly Price"
                value={`${Math.round(
                  averagePrice
                ).toLocaleString('tr-TR')} ₺`}
                icon="💰"
              />
            </div>

            <ReservationTable
              reservations={reservations}
              apartments={apartments}
            />
          </>
        )}

        {activePage === 'Apartments' && <Apartments />}

        {activePage === 'Reservations' && <Reservations />}

        {activePage === 'Calendar' && <Calendar />}

        {![
          'Dashboard',
          'Apartments',
          'Reservations',
          'Calendar'
        ].includes(activePage) && (
          <div>
            <h1>{activePage}</h1>
            <p>This page is under development.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

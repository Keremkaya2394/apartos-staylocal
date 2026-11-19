
import { useState } from 'react'

import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import ReservationTable from './components/ReservationTable'
import type { Reservation } from './components/ReservationTable'

import Apartments from './pages/Apartments'
import Reservations from './pages/Reservations'
import Calendar from './pages/Calendar'
import Revenue from './pages/Revenue'
import Guests from './pages/Guests'

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

function loadData<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) as T : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [apartments, setApartments] = useState(() =>
    loadData<Apartment[]>('apartos-apartments', initialApartments)
  )

  const [reservations, setReservations] = useState(() =>
    loadData<Reservation[]>('apartos-reservations', [])
  )

  function changePage(page: string) {
    setApartments(
      loadData<Apartment[]>('apartos-apartments', initialApartments)
    )

    setReservations(
      loadData<Reservation[]>('apartos-reservations', [])
    )

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

  const averagePrice = totalApartments > 0
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
                value={`${Math.round(averagePrice).toLocaleString('tr-TR')} ₺`}
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

        {activePage === 'Revenue' && <Revenue />}

        {activePage === 'Guests' && <Guests />}

        {![
          'Dashboard',
          'Apartments',
          'Reservations',
          'Calendar',
          'Revenue',
          'Guests'
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

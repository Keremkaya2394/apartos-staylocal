
import { useState } from 'react'

import {
  Building2,
  CalendarCheck,
  UsersRound,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  BedDouble,
  CalendarDays,
  ChevronDown
} from 'lucide-react'

import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import ReservationTable from './components/ReservationTable'
import type { Reservation } from './components/ReservationTable'

import Apartments from './pages/Apartments'
import Reservations from './pages/Reservations'
import Calendar from './pages/Calendar'
import Revenue from './pages/Revenue'
import Guests from './pages/Guests'
import Settings from './pages/Settings'

import './App.css'

type Apartment = {
  id: number
  name: string
  location: string
  price: number
  capacity: number
}

type Business = {
  businessName: string
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
    loadData<Apartment[]>(
      'apartos-apartments',
      initialApartments
    )
  )

  const [reservations, setReservations] = useState(() =>
    loadData<Reservation[]>(
      'apartos-reservations',
      []
    )
  )

  const [business, setBusiness] = useState(() =>
    loadData<Business>(
      'apartos-settings',
      { businessName: 'ApartOS Property' }
    )
  )

  function changePage(page: string) {
    setApartments(
      loadData<Apartment[]>(
        'apartos-apartments',
        initialApartments
      )
    )

    setReservations(
      loadData<Reservation[]>(
        'apartos-reservations',
        []
      )
    )

    setBusiness(
      loadData<Business>(
        'apartos-settings',
        { businessName: 'ApartOS Property' }
      )
    )

    setActivePage(page)
  }

  const now = new Date()

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === 'Confirmed'
  )

  const activeReservations = confirmedReservations.filter(
    (reservation) => reservation.checkOut > today
  ).length

  const totalApartments = apartments.length

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

  const todayCheckIns = confirmedReservations.filter(
    (reservation) => reservation.checkIn === today
  ).length

  const todayCheckOuts = confirmedReservations.filter(
    (reservation) => reservation.checkOut === today
  ).length

  const occupiedApartments = apartments.filter(
    (apartment) =>
      confirmedReservations.some(
        (reservation) =>
          reservation.apartmentId === apartment.id &&
          reservation.checkIn <= today &&
          reservation.checkOut > today
      )
  ).length

  const availableApartments =
    totalApartments - occupiedApartments

  const occupancyRate = totalApartments > 0
    ? Math.round(
        (occupiedApartments / totalApartments) * 100
      )
    : 0

  const businessName =
    business.businessName || 'ApartOS Property'

  return (
    <div className="dashboard-layout">

      <Sidebar
        activePage={activePage}
        onPageChange={changePage}
      />

      <div className="workspace">

        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">

            <div className="topbar-date">
              <CalendarDays size={17} />
              <span>
                {now.toLocaleDateString('en-GB')}
              </span>
            </div>

            <button
              type="button"
              className="profile-button"
              onClick={() => changePage('Settings')}
            >
              <div className="profile-avatar">
                {businessName.slice(0, 1).toUpperCase()}
              </div>

              <div className="profile-info">
                <strong>{businessName}</strong>
                <span>Property Manager</span>
              </div>

              <ChevronDown size={16} />
            </button>

          </div>
        </header>

        <main className="dashboard-content">

          {activePage === 'Dashboard' && (
            <>

              <div className="dashboard-heading">
                <div>
                  <span className="page-eyebrow">
                    PROPERTY OVERVIEW
                  </span>

                  <h1>Dashboard Overview</h1>

                  <p>
                    Welcome back, {businessName}.
                    Here's your property overview.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() =>
                    changePage('Reservations')
                  }
                >
                  <CalendarCheck size={18} />
                  New Reservation
                </button>
              </div>

              <div className="stats">

                <StatCard
                  title="Total Apartments"
                  value={totalApartments}
                  icon={<Building2 size={23} />}
                  description="Registered properties"
                  color="blue"
                />

                <StatCard
                  title="Active Reservations"
                  value={activeReservations}
                  icon={<CalendarCheck size={23} />}
                  description="Current and upcoming"
                  color="green"
                />

                <StatCard
                  title="Total Guest Capacity"
                  value={totalCapacity}
                  icon={<UsersRound size={23} />}
                  description="Maximum guest capacity"
                  color="purple"
                />

                <StatCard
                  title="Average Nightly Price"
                  value={`${Math.round(
                    averagePrice
                  ).toLocaleString('tr-TR')} ₺`}
                  icon={<Wallet size={23} />}
                  description="Across all apartments"
                  color="orange"
                />

              </div>

              <div className="overview-grid">

                <section className="overview-card">

                  <div className="section-heading">
                    <h2>Today's Operations</h2>
                  </div>

                  <p className="muted-text">
                    {formattedDate}
                  </p>

                  <div className="operation-item">
                    <div className="operation-icon green">
                      <ArrowDownToLine size={22} />
                    </div>

                    <div className="operation-info">
                      <strong>Check-ins</strong>
                      <span>Arriving today</span>
                    </div>

                    <strong className="operation-number">
                      {todayCheckIns}
                    </strong>
                  </div>

                  <div className="operation-item">
                    <div className="operation-icon orange">
                      <ArrowUpFromLine size={22} />
                    </div>

                    <div className="operation-info">
                      <strong>Check-outs</strong>
                      <span>Departing today</span>
                    </div>

                    <strong className="operation-number">
                      {todayCheckOuts}
                    </strong>
                  </div>

                  <div className="operation-item">
                    <div className="operation-icon blue">
                      <BedDouble size={22} />
                    </div>

                    <div className="operation-info">
                      <strong>Occupied Apartments</strong>
                      <span>Currently reserved</span>
                    </div>

                    <strong className="operation-number">
                      {occupiedApartments}
                    </strong>
                  </div>

                </section>

                <section className="overview-card">

                  <div className="section-heading">
                    <h2>Current Occupancy</h2>
                  </div>

                  <p className="muted-text">
                    Live overview of apartment availability
                  </p>

                  <div
                    className="occupancy-ring"
                    style={{
                      background: `conic-gradient(
                        #2563eb ${occupancyRate}%,
                        #e8edf5 0
                      )`
                    }}
                  >
                    <div className="occupancy-center">
                      <strong>{occupancyRate}%</strong>
                      <span>Occupancy</span>
                    </div>
                  </div>

                  <div className="occupancy-legend">
                    <div>
                      <span className="legend-dot occupied" />
                      Occupied
                      <strong>{occupiedApartments}</strong>
                    </div>

                    <div>
                      <span className="legend-dot available" />
                      Available
                      <strong>{availableApartments}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-button"
                    onClick={() => changePage('Calendar')}
                  >
                    View Availability Calendar →
                  </button>

                </section>

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

          {activePage === 'Guests' && <Guests />}

          {activePage === 'Revenue' && <Revenue />}

          {activePage === 'Settings' && <Settings />}

          <footer className="workspace-footer">
            <span>ApartOS Property Management</span>
            <span>Version 2.0</span>
          </footer>

        </main>

      </div>

    </div>
  )
}

export default App

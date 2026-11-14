
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import ReservationTable from './components/ReservationTable'
import './App.css'

function App() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Dashboard Overview</h1>
        <p>Welcome to ApartOS Property Management.</p>

        {/* Statistics Cards */}
        <div className="stats">
          <StatCard
            title="Total Apartments"
            value={12}
            icon="🏠"
          />

          <StatCard
            title="Active Reservations"
            value={8}
            icon="📅"
          />

          <StatCard
            title="Available Apartments"
            value={4}
            icon="🔑"
          />

          <StatCard
            title="Monthly Revenue"
            value="₺85,000"
            icon="💰"
          />
        </div>

        {/* Recent Reservations */}
        <ReservationTable />

      </main>
    </div>
  )
}

export default App


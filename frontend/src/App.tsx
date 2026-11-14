
import './App.css'

function App() {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>ApartOS</h1>
        <p>Apartment Management Dashboard</p>
      </header>

      <main>
        <h2>Dashboard Overview</h2>
        <p>Welcome to your property management system.</p>

        <div className="stats">
          <div className="stat-card">
            <h3>Total Apartments</h3>
            <strong>12</strong>
          </div>

          <div className="stat-card">
            <h3>Active Reservations</h3>
            <strong>8</strong>
          </div>

          <div className="stat-card">
            <h3>Available Apartments</h3>
            <strong>4</strong>
          </div>

          <div className="stat-card">
            <h3>Monthly Revenue</h3>
            <strong>₺85,000</strong>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

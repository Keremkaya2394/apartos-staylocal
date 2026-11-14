
import { useState } from 'react'

function Sidebar() {
  const [activeMenu, setActiveMenu] = useState('Dashboard')

  const menuItems = [
    'Dashboard',
    'Apartments',
    'Reservations',
    'Guests',
    'Revenue',
    'Settings'
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>ApartOS</h2>
        <p>Property Management</p>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`sidebar-link ${
              activeMenu === item ? 'active' : ''
            }`}
            onClick={() => setActiveMenu(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>ApartOS v1.0</p>
      </div>
    </aside>
  )
}

export default Sidebar

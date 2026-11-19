
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  CalendarDays,
  UsersRound,
  ChartNoAxesCombined,
  Settings,
  House
} from 'lucide-react'

type SidebarProps = {
  activePage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Apartments', icon: Building2 },
  { name: 'Reservations', icon: CalendarCheck },
  { name: 'Calendar', icon: CalendarDays },
  { name: 'Guests', icon: UsersRound },
  { name: 'Revenue', icon: ChartNoAxesCombined },
  { name: 'Settings', icon: Settings }
]

function Sidebar({
  activePage,
  onPageChange
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <House size={25} />
        </div>

        <div className="sidebar-logo">
          <h2>Apart<span>OS</span></h2>
          <p>Property Management</p>
        </div>
      </div>

      <div className="sidebar-section-title">
        WORKSPACE
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Main navigation"
      >
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.name}
              type="button"
              className={`sidebar-link ${
                activePage === item.name ? 'active' : ''
              }`}
              aria-current={
                activePage === item.name ? 'page' : undefined
              }
              onClick={() => onPageChange(item.name)}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="online-dot" />
          Local development
        </div>

        <p>ApartOS v2.0</p>
      </div>
    </aside>
  )
}

export default Sidebar

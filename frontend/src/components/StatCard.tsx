
type StatCardProps = {
  title: string
  value: string | number
  icon: string
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-icon">{icon}</span>
        <h3>{title}</h3>
      </div>

      <strong>{value}</strong>
    </div>
  )
}

export default StatCard

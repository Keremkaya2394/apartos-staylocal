
import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

function StatCard({
  title,
  value,
  icon,
  description,
  color = 'blue'
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-icon stat-icon-${color}`}>
          {icon}
        </div>
      </div>

      <div className="stat-card-body">
        <h3>{title}</h3>
        <strong>{value}</strong>

        {description && (
          <p className="stat-description">
            {description}
          </p>
        )}
      </div>
    </article>
  )
}

export default StatCard

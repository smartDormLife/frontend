import type { ReactNode } from 'react'
import { Card } from './Card'

interface BoardCardProps {
  title: string
  description: string
  onClick?: () => void
  icon?: ReactNode
  size?: 'md' | 'lg'
}

export function BoardCard({ title, description, onClick, icon, size = 'md' }: BoardCardProps) {
  return (
    <Card
      size={size}
      className="cursor-pointer border border-surface-100 transition hover:-translate-y-0.5 hover:border-primary-100"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="text-primary-600">{icon}</div>}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          <p className="text-sm text-surface-600">{description}</p>
        </div>
      </div>
    </Card>
  )
}

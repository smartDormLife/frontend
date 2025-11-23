import { Card } from './Card'
import type { Dormitory } from '../../types'

interface DormCardProps {
  dorm: Dormitory
  onClick?: (id: number) => void
  size?: 'md' | 'lg'
}

export function DormCard({ dorm, onClick, size = 'md' }: DormCardProps) {
  return (
    <Card
      size={size}
      className="cursor-pointer border border-surface-100 transition hover:-translate-y-0.5 hover:border-primary-100"
      onClick={() => onClick?.(dorm.dorm_id)}
    >
      <p className="text-sm font-semibold text-primary-600">Dormitory</p>
      <h3 className="text-lg font-bold text-surface-900">{dorm.dorm_name}</h3>
    </Card>
  )
}

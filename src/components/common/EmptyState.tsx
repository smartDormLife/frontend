import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionNode?: ReactNode
}

export function EmptyState({ title, description, actionLabel, onAction, actionNode }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-white p-8 text-center text-surface-600">
      <p className="text-base font-semibold text-surface-800">{title}</p>
      {description && <p className="mt-2 text-sm text-surface-500">{description}</p>}
      {actionNode}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}

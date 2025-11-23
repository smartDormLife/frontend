import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface BadgeProps {
  children: ReactNode
  color?: 'primary' | 'green' | 'red' | 'gray' | 'blue' | 'amber'
  className?: string
}

const colorMap: Record<NonNullable<BadgeProps['color']>, string> = {
  primary: 'bg-primary-50 text-primary-700 border border-primary-100',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  red: 'bg-rose-50 text-rose-700 border border-rose-100',
  gray: 'bg-surface-100 text-surface-700 border border-surface-200',
  blue: 'bg-sky-50 text-sky-700 border border-sky-100',
  amber: 'bg-amber-50 text-amber-800 border border-amber-100',
}

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
        clsx(colorMap[color]),
        className,
      )}
    >
      {children}
    </span>
  )
}

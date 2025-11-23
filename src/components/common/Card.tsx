import type { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardSize = 'md' | 'lg'

type CardProps = {
  children: ReactNode
  className?: string
  size?: CardSize
} & HTMLAttributes<HTMLDivElement>

const sizeClass: Record<CardSize, string> = {
  md: 'p-5',
  lg: 'p-7',
}

export function Card({ children, className, size = 'md', ...props }: CardProps) {
  return (
    <div
      className={twMerge('rounded-2xl bg-white shadow-card ring-1 ring-surface-100', sizeClass[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}

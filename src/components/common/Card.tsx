import type { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type CardProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge('rounded-2xl bg-white p-5 shadow-card ring-1 ring-surface-100', className)}
      {...props}
    >
      {children}
    </div>
  )
}

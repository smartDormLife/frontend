import type { SelectHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={twMerge(
        'w-full appearance-none rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-800 shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

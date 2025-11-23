import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300',
  secondary:
    'bg-white text-surface-800 border border-surface-200 hover:border-primary-200 hover:text-primary-700 shadow-sm disabled:bg-surface-100',
  ghost: 'bg-transparent text-surface-700 hover:text-primary-700 hover:bg-primary-50',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base font-semibold',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const content = isLoading ? '로딩 중...' : children
  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300',
        variantClass[variant],
        sizeClass[size],
        clsx(disabled || isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'),
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  )
}

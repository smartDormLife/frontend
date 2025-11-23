import { twMerge } from 'tailwind-merge'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={twMerge('animate-pulse rounded-md bg-surface-200', className)} />
}

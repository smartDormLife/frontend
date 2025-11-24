import type { PostCategory } from '../../types'
import { clsx } from 'clsx'

interface CategoryTabsProps {
  value: PostCategory
  onChange: (category: PostCategory) => void
}

const tabs: { key: PostCategory; label: string }[] = [
  { key: 'delivery', label: '배달 N빵' },
  { key: 'purchase', label: '공구/중고' },
  { key: 'general', label: '자유게시판' },
  { key: 'taxi', label: '택시 N빵' },
]

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'rounded-full px-4 py-2 text-sm font-medium transition',
            value === tab.key
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-700',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

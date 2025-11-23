import { clsx } from 'clsx'
import type { PostCategory } from '../../types'

interface NavTabsProps {
  activeCategory: PostCategory | 'all'
  onChange: (category: PostCategory | 'all') => void
  showAll?: boolean
}

const tabs: { key: PostCategory | 'all'; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'delivery', label: '배달 n빵' },
  { key: 'purchase', label: '공구' },
  { key: 'used_sale', label: '중고' },
  { key: 'taxi', label: '택시 n빵' },
  { key: 'general', label: '자유게시판' },
]

export function NavTabs({ activeCategory, onChange, showAll = true }: NavTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(showAll ? tabs : tabs.filter((tab) => tab.key !== 'all')).map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            'rounded-full px-4 py-2 text-sm font-medium transition',
            activeCategory === tab.key
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

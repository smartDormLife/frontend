import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { Button } from '../common/Button'

export type PostFilterStatus = 'all' | 'recruiting' | 'closed'

interface PostFilterBarProps {
  sort: 'latest' | 'deadline'
  status: PostFilterStatus
  keyword: string
  onChange: (changes: Partial<Pick<PostFilterBarProps, 'sort' | 'status' | 'keyword'>>) => void
  onSearch: () => void
}

export function PostFilterBar({ sort, status, keyword, onChange, onSearch }: PostFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-surface-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={sort}
          onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'deadline' })}
          className="w-36"
        >
          <option value="latest">최신순</option>
          <option value="deadline">마감 임박순</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => onChange({ status: e.target.value as PostFilterStatus })}
          className="w-32"
        >
          <option value="all">전체</option>
          <option value="recruiting">모집중</option>
          <option value="closed">마감</option>
        </Select>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Input
          placeholder="제목, 내용 검색"
          value={keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          className="flex-1"
        />
        <Button variant="secondary" className="whitespace-nowrap" onClick={onSearch}>
          검색
        </Button>
      </div>
    </div>
  )
}

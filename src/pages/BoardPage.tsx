import { useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { NavTabs } from '../components/layout/NavTabs'
import { Button } from '../components/common/Button'
import { PostList } from '../components/post/PostList'
import { PostFilterBar, type PostFilterStatus } from '../components/post/PostFilterBar'
import { postApi } from '../api/postApi'
import { dormApi } from '../api/dormApi'
import type { PostCategory } from '../types'

export function BoardPage() {
  const { dormId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const category = (searchParams.get('category') as PostCategory | 'all' | null) ?? 'delivery'
  const sort = (searchParams.get('sort') as 'latest' | 'deadline' | null) ?? 'latest'
  const status = (searchParams.get('status') as PostFilterStatus | null) ?? 'all'
  const keyword = searchParams.get('keyword') ?? ''

  const { data: dorms } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })
  const dormName = useMemo(
    () => dorms?.find((d) => d.dorm_id === Number(dormId))?.dorm_name ?? '기숙사',
    [dorms, dormId],
  )

  const { data, isLoading } = useQuery({
    queryKey: ['posts', dormId, category, sort, status, keyword],
    enabled: Boolean(dormId),
    queryFn: () =>
      postApi.list({
        dorm_id: dormId ? Number(dormId) : undefined,
        category: category === 'all' ? undefined : category,
        status: status === 'all' ? undefined : status === 'recruiting' ? 'active' : 'closed',
        sort,
        keyword: keyword || undefined,
      }),
  })

  const handleTabChange = (next: PostCategory | 'all') => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('category', next)
    setSearchParams(nextParams)
  }

  const handleFilterChange = (changes: Partial<{ sort: 'latest' | 'deadline'; status: PostFilterStatus; keyword: string }>) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      nextParams.set(key, String(value))
    })
    setSearchParams(nextParams)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-surface-500">{dormName}</p>
          <h1 className="text-2xl font-bold text-surface-900">게시판</h1>
        </div>
        <Button onClick={() => navigate('/posts/new')}>글쓰기</Button>
      </div>

      <NavTabs activeCategory={category} onChange={handleTabChange} />

      <PostFilterBar
        sort={sort}
        status={status}
        keyword={keyword}
        onChange={handleFilterChange}
        onSearch={() => setSearchParams(new URLSearchParams(searchParams))}
      />

      <PostList posts={data?.posts} isLoading={isLoading} />

      {data && data.totalCount > data.posts.length && (
        <div className="flex justify-center">
          <Link to="#" className="text-sm text-primary-600">
            더 불러오기 (총 {data.totalCount}개)
          </Link>
        </div>
      )}
    </div>
  )
}

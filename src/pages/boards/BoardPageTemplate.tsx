import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '../../components/common/Button'
import { CategoryTabs } from '../../components/common/CategoryTabs'
import { PostItem } from '../../components/common/PostItem'
import { EmptyState } from '../../components/common/EmptyState'
import { Input } from '../../components/common/Input'
import type { Post, PostCategory } from '../../types'
import { UnauthorizedPage } from '../UnauthorizedPage'
import { dormApi } from '../../api/dormApi'
import { useAuth } from '../../hooks/useAuth'
import { postApi } from '../../api/postApi'

interface BoardPageTemplateProps {
  title: string
  category: PostCategory
  posts?: Post[]
}

export function BoardPageTemplate({ title, category, posts = [] }: BoardPageTemplateProps) {
  const { dormId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  const [query, setQuery] = useState('')
  const { data: dorms } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })

  if (isLoading) {
    return <p>로딩중...</p>
  }


  const currentDormId = dormId ? Number(dormId) : null
  const isTaxiBoard = category === 'taxi'
  const unauthorized =
    !isTaxiBoard &&
    user &&
    currentDormId &&
    user.dorm_id !== currentDormId
  const dormName = isTaxiBoard
    ? '통합'
    : dorms?.find((d) => d.dorm_id === currentDormId)?.dorm_name ?? '기숙사'

  const dormFilter = isTaxiBoard ? undefined : currentDormId ?? user?.dorm_id ?? undefined

  const listQuery = useQuery({
    queryKey: ['boardPosts', category, dormFilter],
    queryFn: () =>
      postApi.list({
        category: category === 'purchase' ? 'purchase' : category,
        dorm_id: dormFilter,
        status: 'active',
      }),
    enabled: isTaxiBoard || Boolean(dormFilter),
  })

  const apiPosts = Array.isArray(listQuery.data?.posts) ? listQuery.data?.posts : []
  const postsSource = apiPosts.length ? apiPosts : posts

  const filtered = useMemo(() => {
    const byDorm =
      isTaxiBoard || !currentDormId ? postsSource : postsSource.filter((p) => p.dorm_id === currentDormId)
    if (!query.trim()) return byDorm
    const q = query.toLowerCase()
    return byDorm.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
    )
  }, [postsSource, query, currentDormId, isTaxiBoard])

  if (unauthorized) return <UnauthorizedPage />

  const handleTabChange = (next: PostCategory) => {
    if (next === 'taxi') {
      navigate('/board/taxi')
      return
    }
    const targetDorm = currentDormId ?? user?.dorm_id
    navigate(`/board/${targetDorm}/${next}`)
  }

  return (
    <div className="relative space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-surface-500">{dormName} · {title}</p>
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <Input placeholder="제목, 내용 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

        </div>
      </header>

      <CategoryTabs value={category} onChange={handleTabChange} />

      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((post) => (
            <PostItem
              key={post.post_id}
              post={post}
              onClick={(id) => navigate(`/posts/${id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="게시글이 없습니다"
            description="첫 글을 작성해 보세요."
            actionLabel="글쓰기"
            onAction={() =>
              navigate(`/write?category=${category}${currentDormId ? `&dormId=${currentDormId}` : ''}`)
            }
          />
        )}
      </div>

      <Button
        className="fixed bottom-8 right-8 shadow-lg"
        size="lg"
        onClick={() =>
          navigate(`/write?category=${category}${currentDormId ? `&dormId=${currentDormId}` : ''}`)
        }
      >
        글쓰기
      </Button>
    </div>
  )
}

export default BoardPageTemplate

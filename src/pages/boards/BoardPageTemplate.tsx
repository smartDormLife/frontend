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

interface BoardPageTemplateProps {
  title: string
  category: PostCategory
  posts: Post[]
}

export function BoardPageTemplate({ title, category, posts }: BoardPageTemplateProps) {
  const { dormId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { user } = useAuth()
  const { data: dorms } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })

  const currentDormId = dormId ? Number(dormId) : null
  const unauthorized = user && currentDormId ? user.dorm_id !== currentDormId : false
  const dormName = dorms?.find((d) => d.dorm_id === currentDormId)?.dorm_name ?? '기숙사'

  const filtered = useMemo(() => {
    const byDorm = currentDormId ? posts.filter((p) => p.dorm_id === currentDormId) : posts
    if (!query.trim()) return byDorm
    const q = query.toLowerCase()
    return byDorm.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q),
    )
  }, [posts, query, currentDormId])

  if (unauthorized) return <UnauthorizedPage />

  const handleTabChange = (next: PostCategory) => {
    navigate(`/board/${currentDormId}/${next}`)
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
          <Button
            size="md"
            className="whitespace-nowrap"
            onClick={() =>
              navigate(`/write?category=${category}${currentDormId ? `&dormId=${currentDormId}` : ''}`)
            }
          >
            글쓰기
          </Button>
        </div>
      </header>

      <CategoryTabs value={category} onChange={handleTabChange} />

      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((post) => <PostItem key={post.post_id} post={post} />)
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

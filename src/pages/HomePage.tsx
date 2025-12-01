import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postApi } from '../api/postApi'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { PostCard } from '../components/post/PostCard'
import { useAuth } from '../hooks/useAuth'
import type { Post } from '../types'

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const dormId = user?.dorm_id ?? 1

  const { data: activePosts, isLoading } = useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => postApi.recent(5),
  })
  const safeActivePosts = Array.isArray(activePosts?.posts) ? activePosts.posts : []

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900">최근 활성 파티</h2>
          <Button variant="ghost" onClick={() => navigate(`/board/${dormId}/delivery`)}>
            더 보기
          </Button>
        </div>
        <PostCardListPreview data={safeActivePosts} isLoading={isLoading} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900">카테고리별 게시판 바로가기</h2>
          <p className="text-sm text-surface-600">배달/공구/택시/자유 게시판으로 이동하세요</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BoardLinkCard title="배달 N빵 게시판" description="같이 배달하고 배달비 나누기" onClick={() => navigate(`/board/${dormId}/delivery`)} />
          <BoardLinkCard title="공구/중고 거래 게시판" description="공동구매 및 중고 거래" onClick={() => navigate(`/board/${dormId}/purchase`)} />
          <BoardLinkCard title="택시 N빵 게시판" description="같이 이동하고 택시비 나누기" onClick={() => navigate('/board/taxi')} />
          <BoardLinkCard title="자유게시판" description="자유로운 소통 공간" onClick={() => navigate(`/board/${dormId}/general`)} />
        </div>
      </section>
    </div>
  )
}

function PostCardListPreview({ data, isLoading }: { data: Post[] | undefined; isLoading?: boolean }) {
  const safeData = Array.isArray(data) ? data : []
  if (isLoading) {
    return <p className="text-sm text-surface-600">불러오는 중...</p>
  }
  if (!safeData.length) return <Card className="text-sm text-surface-600">현재 모집 중인 파티가 없어요.</Card>
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {safeData.slice(0, 4).map((post) => (
        <PostCard key={post.post_id} post={post} compact />
      ))}
    </div>
  )
}

function BoardLinkCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <Card className="cursor-pointer border border-surface-100 transition hover:-translate-y-0.5 hover:border-primary-100" onClick={onClick}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
        <p className="text-sm text-surface-600">{description}</p>
      </div>
    </Card>
  )
}

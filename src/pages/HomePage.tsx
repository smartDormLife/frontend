import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { dormApi } from '../api/dormApi'
import { postApi } from '../api/postApi'
import { Card } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { PostCard } from '../components/post/PostCard'
import type { Dormitory, Post } from '../types'

export function HomePage() {
  const navigate = useNavigate()
  const { data: dormsData, isError: dormsError } = useQuery({
    queryKey: ['dormitories'],
    queryFn: dormApi.list,
  })
  const { data: activePosts, isLoading, isError: activeError } = useQuery({
    queryKey: ['posts', 'activePreview'],
    queryFn: () => postApi.list({ status: 'active', size: 5 }),
  })
  const fallbackDorms: Dormitory[] = [
    { dorm_id: 1, dorm_name: '남제관' },
    { dorm_id: 2, dorm_name: '용지관' },
    { dorm_id: 3, dorm_name: '광교관' },
    { dorm_id: 4, dorm_name: '화홍관' },
    { dorm_id: 5, dorm_name: '국제학사' },
    { dorm_id: 6, dorm_name: '일신관' },
  ]

  const dorms = Array.isArray(dormsData) && dormsData.length ? dormsData : fallbackDorms
  const safeActivePosts = Array.isArray(activePosts?.posts) ? activePosts.posts : []

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-indigo-500 to-sky-500 p-6 text-white shadow-xl md:p-8">
        <div className="absolute right-16 top-8 hidden h-40 w-40 rounded-full bg-white/10 blur-3xl md:block" />
        <div className="relative grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wide text-white/70">슬기로운 긱사생활</p>
            <h1 className="text-3xl font-bold md:text-4xl">기숙사생을 위한 커뮤니티</h1>
            <p className="text-lg text-white/80">기숙사 선택부터 파티 모집까지 한 화면에서.</p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/login')}>시작하기</Button>
              <Button variant="secondary" onClick={() => navigate('/register')}>
                회원가입
              </Button>
            </div>
          </div>
          <Card className="border border-white/10 bg-white/10 text-white backdrop-blur-sm">
            <p className="text-sm font-semibold text-white/80">실시간 인기 파티</p>
            <div className="mt-4 space-y-3">
              {isLoading && <p className="text-sm text-white/70">불러오는 중...</p>}
              {safeActivePosts.slice(0, 3).map((post) => (
                <div key={post.post_id} className="rounded-xl bg-white/10 p-3">
                  <p className="text-sm font-semibold">{post.title}</p>
                  <p className="text-xs text-white/70">{post.party?.location ?? '장소 미정'}</p>
                </div>
              ))}
              {!isLoading && !safeActivePosts.length && (
                <p className="text-sm text-white/70">아직 활성 파티가 없어요. 첫 파티를 만들어보세요!</p>
              )}
              {activeError && <p className="text-sm text-rose-100">파티 정보를 불러오지 못했어요.</p>}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900">기숙사 선택</h2>
          <p className="text-sm text-surface-600">각 기숙사별 게시판으로 바로 이동하세요</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(dormsError ? fallbackDorms : dorms).map((dorm) => (
            <Card key={dorm.dorm_id} className="flex flex-col gap-3 border border-surface-100">
              <div>
                <p className="text-sm font-semibold text-primary-600">Dormitory</p>
                <h3 className="text-lg font-bold text-surface-900">{dorm.dorm_name}</h3>
              </div>
              <Button variant="secondary" onClick={() => navigate(`/board/${dorm.dorm_id}/delivery`)}>
                게시판 바로가기
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900">최근 활성 파티</h2>
          <Button variant="ghost" onClick={() => navigate('/board/1/delivery')}>
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
          <BoardLinkCard title="배달 N빵 게시판" description="같이 배달하고 배달비 나누기" onClick={() => navigate('/board/1/delivery')} />
          <BoardLinkCard title="공구/중고 거래 게시판" description="공동구매 및 중고 거래" onClick={() => navigate('/board/1/purchase')} />
          <BoardLinkCard title="택시 N빵 게시판" description="같이 이동하고 택시비 나누기" onClick={() => navigate('/board/taxi')} />
          <BoardLinkCard title="자유게시판" description="자유로운 소통 공간" onClick={() => navigate('/board/1/general')} />
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

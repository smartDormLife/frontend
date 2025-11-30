import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { userApi } from '../api/userApi'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { Badge } from '../components/common/Badge'
import { UserInfoCard } from '../components/profile/UserInfoCard'
import type { MyComment, Post, UserProfile } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('ko')

const mockMode = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

const mockProfile: UserProfile = {
  name: '남제관',
  email: 'mock@example.com',
  dorm_name: '1동',
  room_no: '101호',
  phone: '010-0000-0000',
}

const mockPosts: Post[] = [
  {
    post_id: 101,
    user_id: 9999,
    dorm_id: 1,
    dorm_name: '1동',
    category: 'delivery',
    title: '저녁 치킨 n빵 구합니다',
    content: '오늘 저녁 7시 전에 주문하려고 해요. 2~3명 더 구해요.',
    price: null,
    status: 'active',
    created_at: dayjs().subtract(2, 'hour').toISOString(),
    comment_count: 3,
    current_member_count: 2,
    max_member: 4,
  },
  {
    post_id: 102,
    user_id: 9999,
    dorm_id: 1,
    dorm_name: '1동',
    category: 'purchase',
    title: '생필품 공구 (주방세제)',
    content: '대량구매 할인 조건 맞추려고 합니다. 관심 있으신 분 댓글 주세요.',
    price: null,
    status: 'active',
    created_at: dayjs().subtract(1, 'day').toISOString(),
    comment_count: 1,
    current_member_count: 3,
    max_member: 5,
  },
  {
    post_id: 103,
    user_id: 9999,
    dorm_id: 1,
    dorm_name: '1동',
    category: 'general',
    title: '세탁실 이용 팁 공유',
    content: '세탁기 예약 방법과 건조 효율 올리는 팁 적어봤어요.',
    price: null,
    status: 'active',
    created_at: dayjs().subtract(3, 'day').toISOString(),
    comment_count: 2,
  },
]

const mockParties: Post[] = [
  {
    post_id: 201,
    user_id: 123,
    dorm_id: 1,
    dorm_name: '1동',
    category: 'delivery',
    title: '야식 떡볶이 같이 시킬 분',
    content: '자정 전에 주문 예정입니다.',
    price: null,
    status: 'active',
    created_at: dayjs().subtract(30, 'minute').toISOString(),
    comment_count: 4,
    max_member: 4,
    current_member_count: 3,
    party_role: 'member',
    party: {
      party_id: 9001,
      post_id: 201,
      host_id: 123,
      location: '1동 로비',
      deadline: dayjs().add(1, 'hour').toISOString(),
      max_member: 4,
      status: 'recruiting',
      created_at: dayjs().subtract(30, 'minute').toISOString(),
      current_member_count: 3,
      is_joined: true,
    },
  },
  {
    post_id: 202,
    user_id: 9999,
    dorm_id: null,
    dorm_name: null,
    category: 'taxi',
    title: '택시 n빵 (기숙사→터미널)',
    content: '내일 아침 9시 출발 예정, 2명 구합니다.',
    price: null,
    status: 'active',
    created_at: dayjs().subtract(5, 'hour').toISOString(),
    comment_count: 0,
    max_member: 3,
    current_member_count: 1,
    party_role: 'host',
    party: {
      party_id: 9002,
      post_id: 202,
      host_id: 9999,
      location: '기숙사 정문',
      deadline: dayjs().add(12, 'hour').toISOString(),
      max_member: 3,
      status: 'recruiting',
      created_at: dayjs().subtract(5, 'hour').toISOString(),
      current_member_count: 1,
      is_joined: true,
    },
  },
]

const mockComments: MyComment[] = [
  {
    comment_id: 3001,
    post_id: 201,
    user_id: 9999,
    content: '저도 참여합니다!',
    created_at: dayjs().subtract(25, 'minute').toISOString(),
    post: mockParties[0],
  },
  {
    comment_id: 3002,
    post_id: 102,
    user_id: 9999,
    content: '수량 2개 가능합니다.',
    created_at: dayjs().subtract(20, 'hour').toISOString(),
    post: mockPosts[1],
  },
]

const categoryLabel: Record<Post['category'], string> = {
  delivery: '배달 n빵',
  purchase: '공구',
  taxi: '택시 n빵',
  used_sale: '중고',
  general: '자유',
}

export function MyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const profileQuery = useQuery<UserProfile>({
    queryKey: ['myProfile'],
    queryFn: userApi.profile,
    enabled: !mockMode && Boolean(user),
  })

  const myPostsQuery = useQuery({
    queryKey: ['myPosts'],
    queryFn: () => userApi.myPosts({ size: 5 }),
    enabled: !mockMode && Boolean(user),
  })

  const myCommentsQuery = useQuery({
    queryKey: ['myComments'],
    queryFn: () => userApi.myComments({ size: 6 }),
    enabled: !mockMode && Boolean(user),
  })

  const myPartiesQuery = useQuery({
    queryKey: ['myParties'],
    queryFn: () => userApi.myParties({ size: 5 }),
    enabled: !mockMode && Boolean(user),
  })

  const profileData = mockMode ? mockProfile : profileQuery.data
  const myPostsData = mockMode
    ? { items: mockPosts, totalCount: mockPosts.length, page: 1, size: mockPosts.length }
    : myPostsQuery.data
  const myPartiesData = mockMode
    ? { items: mockParties, totalCount: mockParties.length, page: 1, size: mockParties.length }
    : myPartiesQuery.data
  const myCommentsData = mockMode
    ? { items: mockComments, totalCount: mockComments.length, page: 1, size: mockComments.length }
    : myCommentsQuery.data

  const activityStats = useMemo(
    () => [
      {
        label: '작성한 글',
        value: myPostsData?.totalCount ?? 0,
        hint: '최근 5건 기준으로 보여드려요',
      },
      {
        label: '작성한 댓글',
        value: myCommentsData?.totalCount ?? 0,
        hint: '모든 댓글을 최신순으로 확인할 수 있어요',
      },
      {
        label: '참여 중인 파티',
        value: myPartiesData?.totalCount ?? 0,
        hint: '호스트/멤버 여부도 함께 표기됩니다',
      },
    ],
    [myPostsData?.totalCount, myCommentsData?.totalCount, myPartiesData?.totalCount],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-surface-500">내 정보</p>
        <h1 className="text-2xl font-bold text-surface-900">마이페이지</h1>
        <p className="text-sm text-surface-600">로그인한 계정의 활동을 한눈에 확인하세요.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {(!mockMode && profileQuery.isLoading) && (
            <Card>
              <EmptyState title="불러오는 중" description="잠시만 기다려 주세요." />
            </Card>
          )}
          {profileData && <UserInfoCard profile={profileData} />}
          {!mockMode && !profileQuery.isLoading && !profileQuery.data && (
            <Card>
              <EmptyState title="내 정보를 불러오지 못했어요" description="로그인을 확인해주세요." />
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full space-y-4 bg-gradient-to-br from-primary-50/60 via-white to-sky-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-600">내 활동 요약</p>
                <p className="text-xl font-bold text-surface-900">최근 작성/참여 현황</p>
              </div>
              <Badge color="primary" className="bg-primary-100 text-primary-700">
                로그인 완료
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {activityStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/60 bg-white/80 p-4 shadow-inner backdrop-blur"
                >
                  <p className="text-xs font-medium text-surface-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-surface-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-surface-500">{stat.hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <SectionTitle title="내가 쓴 게시물" description="최근 작성한 글을 빠르게 열람하세요." />
          {(!mockMode && myPostsQuery.isLoading) && <LoadingList />}
          {!mockMode && !myPostsQuery.isLoading && (myPostsQuery.data?.items.length ?? 0) === 0 && (
            <EmptyState title="작성한 글이 없어요" description="글을 작성하면 여기에서 모아볼 수 있어요." />
          )}
          {!!myPostsData?.items.length && (
            <div className="space-y-3">
              {myPostsData.items.map((post) => (
                <MyPostItem key={post.post_id} post={post} onClick={(id) => navigate(`/posts/${id}`)} />
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <SectionTitle title="참여 중인 파티" description="현재 들어가 있는 파티를 확인하세요." />
          {(!mockMode && myPartiesQuery.isLoading) && <LoadingList />}
          {!mockMode && !myPartiesQuery.isLoading && (myPartiesQuery.data?.items.length ?? 0) === 0 && (
            <EmptyState title="참여 중인 파티가 없어요" description="파티에 참여하면 여기에서 확인할 수 있어요." />
          )}
          {!!myPartiesData?.items.length && (
            <div className="space-y-3">
              {myPartiesData.items.map((post) => (
                <MyPartyItem
                  key={post.post_id}
                  post={post}
                  currentUserId={user?.user_id}
                  onClick={(id) => navigate(`/posts/${id}`)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-4">
        <SectionTitle title="내가 남긴 댓글" description="댓글이 달린 게시글로 바로 이동할 수 있어요." />
        {(!mockMode && myCommentsQuery.isLoading) && <LoadingList rows={4} />}
        {!mockMode && !myCommentsQuery.isLoading && (myCommentsQuery.data?.items.length ?? 0) === 0 && (
          <EmptyState title="작성한 댓글이 없어요" description="댓글을 달면 시간순으로 보여드릴게요." />
        )}
        {!!myCommentsData?.items.length && (
          <div className="space-y-3">
            {myCommentsData.items.map((comment) => (
              <MyCommentItem key={comment.comment_id} comment={comment} onClickPost={navigate} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base font-semibold text-surface-900">{title}</p>
      {description && <p className="text-sm text-surface-600">{description}</p>}
    </div>
  )
}

function LoadingList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 shadow-inner"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded-full bg-surface-200" />
            <div className="h-4 w-20 rounded-full bg-surface-200" />
          </div>
          <div className="mt-3 h-3 w-3/4 rounded-full bg-surface-200" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-surface-200" />
        </div>
      ))}
    </div>
  )
}

function MyPostItem({ post, onClick }: { post: Post; onClick: (postId: number) => void }) {
  const currentCount = post.party?.current_member_count ?? post.current_member_count ?? 0
  const maxCount = post.party?.max_member ?? post.max_member ?? null
  const isFull = maxCount != null ? currentCount >= maxCount : false

  return (
    <button
      type="button"
      onClick={() => onClick(post.post_id)}
      className="w-full rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="primary">{categoryLabel[post.category]}</Badge>
          <Badge color={post.status === 'active' ? 'green' : 'red'}>{post.status === 'active' ? '진행중' : '마감'}</Badge>
          {post.comment_count != null && <Badge color="gray">댓글 {post.comment_count}</Badge>}
        </div>
        <p className="text-xs text-surface-500">{dayjs(post.created_at).fromNow()}</p>
      </div>
      <p className="mt-2 text-base font-semibold text-surface-900">{post.title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-surface-600">{post.content}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500">
        {post.dorm_name && <span>{post.dorm_name}</span>}
        {maxCount && (
          <span className={isFull ? 'text-rose-500' : undefined}>
            인원 {currentCount}/{maxCount}
          </span>
        )}
      </div>
    </button>
  )
}

function MyPartyItem({
  post,
  currentUserId,
  onClick,
}: {
  post: Post
  currentUserId?: number
  onClick: (postId: number) => void
}) {
  const party = post.party
  const currentCount = party?.current_member_count ?? post.current_member_count ?? 0
  const maxCount = party?.max_member ?? post.max_member ?? null
  const isHost = party?.host_id === currentUserId || post.party_role === 'host'
  const role = post.party_role ?? (isHost ? 'host' : 'member')

  return (
    <button
      type="button"
      onClick={() => onClick(post.post_id)}
      className="w-full rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge color="blue">{categoryLabel[post.category]}</Badge>
          <Badge color={role === 'host' ? 'primary' : 'gray'}>{role === 'host' ? '호스트' : '멤버'}</Badge>
          {party?.status === 'closed' && <Badge color="red">마감</Badge>}
        </div>
        <p className="text-xs text-surface-500">{dayjs(post.created_at).fromNow()}</p>
      </div>
      <p className="mt-2 text-base font-semibold text-surface-900">{post.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-600">
        {party?.location && <span>모임 장소: {party.location}</span>}
        {party?.deadline && <span>마감 {dayjs(party.deadline).fromNow()}</span>}
        {maxCount && (
          <span>
            인원 {currentCount}/{maxCount}
          </span>
        )}
      </div>
    </button>
  )
}

function MyCommentItem({ comment, onClickPost }: { comment: MyComment; onClickPost: (path: string) => void }) {
  const post = comment.post
  if (!post) return null
  return (
    <button
      type="button"
      onClick={() => onClickPost(`/posts/${post.post_id}`)}
      className="w-full rounded-xl border border-surface-100 bg-surface-50 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="gray">{categoryLabel[post.category]}</Badge>
          {post.dorm_name && <Badge color="blue">{post.dorm_name}</Badge>}
        </div>
        <p className="text-xs text-surface-500">{dayjs(comment.created_at).fromNow()}</p>
      </div>
      <p className="mt-2 text-sm font-semibold text-surface-900">[{post.title}]</p>
      <p className="mt-1 line-clamp-2 text-sm text-surface-600">{comment.content}</p>
    </button>
  )
}

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../../types'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'

dayjs.extend(relativeTime)
dayjs.locale('ko')

interface PostCardProps {
  post: Post
  onClick?: (postId: number) => void
  compact?: boolean
}

const categoryLabel: Record<Post['category'], string> = {
  delivery: '배달 n빵',
  purchase: '공구',
  taxi: '택시 n빵',
  used_sale: '중고',
  general: '자유',
}

export function PostCard({ post, onClick, compact }: PostCardProps) {
  const navigate = useNavigate()
  const handleClick = () => {
    if (onClick) onClick(post.post_id)
    else navigate(`/posts/${post.post_id}`)
  }

  const party = post.party
  const isRecruiting = party?.status === 'recruiting' && post.status === 'active'

  return (
    <Card
      className="cursor-pointer border border-transparent transition hover:-translate-y-0.5 hover:border-primary-100"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge color="primary">{categoryLabel[post.category]}</Badge>
            {isRecruiting && <Badge color="green">모집중</Badge>}
            {!isRecruiting && party && <Badge color="red">마감</Badge>}
          </div>
          <h3 className="text-lg font-semibold text-surface-900">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-surface-600">{post.content}</p>
          {!compact && party && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-surface-600">
              <span>
                인원 {party.current_member_count ?? 0}/{party.max_member}
              </span>
              {party.deadline && <span>마감 {dayjs(party.deadline).fromNow()}</span>}
              {party.location && <span>장소 {party.location}</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-sm text-surface-500">
          <span>{post.user?.name ?? '익명'}</span>
          <span>{dayjs(post.created_at).fromNow()}</span>
          {post.price != null && (
            <span className="text-base font-semibold text-primary-700">
              {post.price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import type { Post } from '../../types'
import { Card } from './Card'

dayjs.extend(relativeTime)
dayjs.locale('ko')

interface PostItemProps {
  post: Post
  onClick?: (id: number) => void
}

export function PostItem({ post, onClick }: PostItemProps) {
  return (
    <Card
      className="cursor-pointer border border-surface-100 transition hover:-translate-y-0.5 hover:border-primary-100"
      onClick={() => onClick?.(post.post_id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-surface-900">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-surface-600">{post.content}</p>
        </div>
        <div className="flex flex-col items-end text-xs text-surface-500">
          <span>{post.user?.name ?? '익명'}</span>
          <span>{dayjs(post.created_at).fromNow()}</span>
        </div>
      </div>
    </Card>
  )
}

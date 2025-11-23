import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import type { Comment } from '../../types'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

interface CommentListProps {
  comments?: Comment[]
  onDelete?: (commentId: number) => void
  currentUserId?: number
}

dayjs.extend(relativeTime)
dayjs.locale('ko')

export function CommentList({ comments = [], onDelete, currentUserId }: CommentListProps) {
  if (!comments.length) {
    return <Card className="text-sm text-surface-600">첫 댓글을 남겨보세요!</Card>
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Card key={comment.comment_id} className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-surface-800">{comment.user?.name ?? '익명'}</p>
            <p className="text-sm text-surface-700">{comment.content}</p>
            <p className="text-xs text-surface-500">{dayjs(comment.created_at).fromNow()}</p>
          </div>
          {onDelete && currentUserId === comment.user_id && (
            <Button variant="ghost" size="sm" onClick={() => onDelete(comment.comment_id)}>
              삭제
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}

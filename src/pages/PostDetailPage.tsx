import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { postApi } from '../api/postApi'
import { partyApi } from '../api/partyApi'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { Textarea } from '../components/common/Textarea'
import { CommentList } from '../components/post/CommentList'
import { useAuth } from '../hooks/useAuth'
import type { Post } from '../types'

const categoryLabel: Record<Post['category'], string> = {
  delivery: '배달 n빵',
  purchase: '공구',
  taxi: '택시 n빵',
  used_sale: '중고',
  general: '자유',
}

dayjs.extend(relativeTime)
dayjs.locale('ko')

export function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [comment, setComment] = useState('')

  const postQuery = useQuery({
    queryKey: ['post', postId],
    enabled: Boolean(postId),
    queryFn: () => postApi.detail(Number(postId)),
  })

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    enabled: Boolean(postId),
    queryFn: () => postApi.listComments(Number(postId)),
  })

  const joinMutation = useMutation({
    mutationFn: () => partyApi.join(postQuery.data?.party?.party_id ?? 0),
    onSuccess: () => postQuery.refetch(),
  })

  const leaveMutation = useMutation({
    mutationFn: () => partyApi.leave(postQuery.data?.party?.party_id ?? 0),
    onSuccess: () => postQuery.refetch(),
  })

  const addCommentMutation = useMutation({
    mutationFn: () => postApi.addComment(Number(postId), comment),
    onSuccess: () => {
      setComment('')
      commentsQuery.refetch()
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => postApi.deleteComment(commentId),
    onSuccess: () => commentsQuery.refetch(),
  })

  const post = postQuery.data

  if (postQuery.isLoading) return <p>불러오는 중...</p>
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>

  const isOwner = user?.user_id === post.user_id
  const party = post.party
  const isJoined = party?.is_joined

  const handleJoinOrLeave = () => {
    if (!party || party.status === 'closed') return
    if (isJoined) {
      leaveMutation.mutate()
      return
    }
    joinMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge color="primary">{categoryLabel[post.category]}</Badge>
              {post.status === 'active' ? <Badge color="green">진행중</Badge> : <Badge color="red">마감</Badge>}
            </div>
            <h1 className="text-2xl font-bold text-surface-900">{post.title}</h1>
            <p className="text-sm text-surface-600">
              작성자: {post.user?.name ?? '익명'} · {dayjs(post.created_at).fromNow()}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/posts/new?edit=${post.post_id}`)}>
                수정
              </Button>
              <Button variant="ghost" size="sm">
                삭제
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3 text-surface-800">
          <p className="whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
          {post.price && <p className="font-semibold text-primary-700">예상 금액: {post.price.toLocaleString()}원</p>}
          {post.category !== 'general' && <p className="text-sm text-surface-600">계좌번호는 호스트에게 문의하세요.</p>}
        </div>
      </Card>

      {party && (
        <Card className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary-600">파티 정보</p>
            <p className="text-lg font-bold text-surface-900">
              인원 {party.current_member_count ?? 0}/{party.max_member} · {party.location ?? '장소 미정'}
            </p>
            {party.deadline && <p className="text-sm text-surface-600">마감 {dayjs(party.deadline).fromNow()}</p>}
          </div>
          <div className="flex gap-2">
            {party.status === 'recruiting' ? (
              <Button
                onClick={handleJoinOrLeave}
                isLoading={joinMutation.isPending || leaveMutation.isPending}
                variant={isJoined ? 'secondary' : 'primary'}
              >
                {isJoined ? '파티 나가기' : '파티 참여하기'}
              </Button>
            ) : (
              <Badge color="red">마감</Badge>
            )}
          </div>
        </Card>
      )}

      <Card className="space-y-4">
        <p className="text-lg font-bold text-surface-900">댓글</p>
        <div className="flex flex-col gap-3">
          <Textarea
            rows={3}
            placeholder="댓글을 남겨보세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => addCommentMutation.mutate()}
              disabled={!comment.trim()}
              isLoading={addCommentMutation.isPending}
            >
              댓글 등록
            </Button>
          </div>
        </div>
        <CommentList
          comments={commentsQuery.data}
          onDelete={deleteCommentMutation.mutate}
          currentUserId={user?.user_id}
        />
      </Card>
    </div>
  )
}

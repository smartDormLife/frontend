import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { postApi } from '../api/postApi'
import { partyApi } from '../api/partyApi'
import { chatApi } from '../api/chatApi'
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
  const queryClient = useQueryClient()

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
    onSuccess: () => {
      postQuery.refetch()
      // 목록 데이터도 갱신하여 뒤로가기 시 최신 상태 반영
      queryClient.invalidateQueries({ queryKey: ['boardPosts'] })
      queryClient.invalidateQueries({ queryKey: ['myParties'] })
    },
  })

  const leaveMutation = useMutation({
    mutationFn: () => partyApi.leave(postQuery.data?.party?.party_id ?? 0),
    onSuccess: () => {
      postQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['boardPosts'] })
      queryClient.invalidateQueries({ queryKey: ['myParties'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => postApi.remove(post?.post_id ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardPosts'] })
      queryClient.invalidateQueries({ queryKey: ['myPosts'] })
      if (post?.dorm_id) {
        navigate(`/board/${post.dorm_id}/${post.category}`)
      } else {
        navigate('/')
      }
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: () => postApi.addComment(Number(postId), comment),
    onSuccess: () => {
      setComment('')
      commentsQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['myComments'] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => postApi.deleteComment(commentId),
    onSuccess: () => {
      commentsQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['myComments'] })
    },
  })

  const closeMutation = useMutation({
    mutationFn: () => partyApi.close(postQuery.data?.party?.party_id ?? 0),
    onSuccess: () => {
      postQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['boardPosts'] })
      queryClient.invalidateQueries({ queryKey: ['myParties'] })
    },
  })

  const post = postQuery.data

  if (postQuery.isLoading) return <p>불러오는 중...</p>
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>

  const isOwner = user?.user_id === post.user_id
  const party = post.party
  const isJoined = party?.is_joined
  const currentCount = party?.current_member_count ?? post.current_member_count ?? 0
  const maxCount = party?.max_member ?? post.max_member ?? null
  const isFull = maxCount != null ? currentCount >= maxCount : false



  const handleEnterChat = async () => {
    if (!party) return
    try {
      // 1. 먼저 기존 채팅방 목록 조회
      const rooms = await chatApi.getRooms()
      let chatRoom = rooms.find((room) => room.party_id === party.party_id)

      // 2. 채팅방이 없으면 생성
      if (!chatRoom) {
        try {
          chatRoom = await chatApi.createRoom(party.party_id)
        } catch (createError: any) {
          // 백엔드 미구현 시 명확한 메시지 표시
          console.error('채팅방 생성 실패:', createError)
          alert('채팅방 생성 기능이 아직 준비되지 않았습니다. 백엔드 구현을 기다려주세요.')
          return
        }
      }

      // 3. 채팅방으로 이동
      if (chatRoom) {
        navigate(`/chat/${chatRoom.room_id}`)
      }
    } catch (error) {
      console.error('채팅방 조회 실패:', error)
      alert('채팅방을 불러오는데 실패했습니다. 백엔드 연결을 확인해주세요.')
    }
  }



  const handleCloseParty = () => {
    if (confirm('파티를 마감하시겠습니까?')) {
      closeMutation.mutate()
    }
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate(
                    `/write?postId=${post.post_id}&category=${post.category}${post.dorm_id ? `&dormId=${post.dorm_id}` : ''
                    }`,
                  )
                }
              >
                수정
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('정말 삭제하시겠어요?')) deleteMutation.mutate()
                }}
                isLoading={deleteMutation.isPending}
              >
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
              인원 {currentCount}/{maxCount} · {party.location ?? '장소 미정'}
            </p>
            {party.deadline && (post.category === 'delivery' || post.category === 'taxi') && (
              <p className="text-sm text-surface-600">
                약속시간: {dayjs(party.deadline).format('M월 D일 HH:mm')}
                ({dayjs(party.deadline).isAfter(dayjs())
                  ? dayjs(party.deadline).fromNow()
                  : '시간 초과'})
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {/* 호스트인 경우 */}
            {isOwner && (
              <>
                <Button onClick={handleEnterChat} variant="primary">
                  채팅방 입장하기
                </Button>
                {party.status === 'recruiting' ? (
                  <Button
                    onClick={handleCloseParty}
                    isLoading={closeMutation.isPending}
                    variant="secondary"
                  >
                    파티 마감하기
                  </Button>
                ) : (
                  <Badge color="red">마감됨</Badge>
                )}
              </>
            )}

            {/* 멤버인 경우 (호스트 제외) */}
            {!isOwner && isJoined && (
              <>
                <Button onClick={handleEnterChat} variant="primary">
                  채팅방 입장하기
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('파티에서 나가시겠습니까?')) leaveMutation.mutate()
                  }}
                  isLoading={leaveMutation.isPending}
                  variant="secondary"
                >
                  파티 나가기
                </Button>
              </>
            )}

            {/* 참여하지 않은 경우 */}
            {!isOwner && !isJoined && (
              party.status === 'recruiting' && !isFull ? (
                <Button
                  onClick={() => joinMutation.mutate()}
                  isLoading={joinMutation.isPending}
                  variant="primary"
                >
                  파티 참여하기
                </Button>
              ) : (
                <Badge color="red">마감</Badge>
              )
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

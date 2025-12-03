import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  {
    post_id: 31,
    user_id: 7,
    dorm_id: 1,
    category: 'general',
    title: '시험기간 스터디원 모집',
    content: '자료구조/운영체제 함께 공부하실 분 3명 구해요.',
    price: null,
    status: 'active',
    created_at: '2025-02-02T13:00:00Z',
    user: { name: '정유나', dorm_id: 1 },
  },
  {
    post_id: 32,
    user_id: 8,
    dorm_id: 1,
    category: 'general',
    title: '기숙사 택배 보관 주의',
    content: '최근 분실 사례 있어요. 무인택배함 이용 권장합니다.',
    price: null,
    status: 'active',
    created_at: '2025-02-03T09:20:00Z',
    user: { name: '안태윤', dorm_id: 1 },
  },
]

export function GeneralBoard() {
  const { dormId } = useParams<{ dormId: string }>()
  const { user, isLoading } = useAuth()

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return <div>로딩중...</div>
  }

  // 사용자 정보가 없으면 로그인 페이지로
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // dormId가 없으면 사용자의 기숙사로 리다이렉트
  if (!dormId) {
    return <Navigate to={`/board/${user.dorm_id}/general`} replace />
  }

  // dormId와 user.dorm_id가 일치하지 않으면 권한 없음 페이지로
  if (Number(dormId) !== user.dorm_id) {
    return <Navigate to="/unauthorized" replace />
  }

  return <BoardPageTemplate title="자유게시판" category="general" posts={posts} />
}

export default GeneralBoard
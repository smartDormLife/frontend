import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  // {
  //   post_id: 11,
  //   user_id: 3,
  //   dorm_id: 1,
  //   category: 'purchase',
  //   title: '텀블러 공동구매 5명',
  //   content: '스탠리 텀블러 공구합니다. 색상 모아서 주문 예정.',
  //   price: 25000,
  //   status: 'active',
  //   created_at: '2025-02-03T10:00:00Z',
  //   user: { name: '이도현', dorm_id: 1 },
  // },
  // {
  //   post_id: 12,
  //   user_id: 4,
  //   dorm_id: 1,
  //   category: 'used_sale',
  //   title: '전기포트 중고 판매',
  //   content: '거의 새 것, 1만원. 광교관 로비 직거래 원합니다.',
  //   price: 10000,
  //   status: 'active',
  //   created_at: '2025-02-04T08:30:00Z',
  //   user: { name: '최하늘', dorm_id: 1 },
  // },
]

export function PurchaseBoard() {
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
    return <Navigate to={`/board/${user.dorm_id}/purchase`} replace />
  }

  // dormId와 user.dorm_id가 일치하지 않으면 권한 없음 페이지로
  if (Number(dormId) !== user.dorm_id) {
    return <Navigate to="/unauthorized" replace />
  }

  return <BoardPageTemplate title="공구/중고 거래 게시판" category="purchase" posts={posts} />
}

export default PurchaseBoard
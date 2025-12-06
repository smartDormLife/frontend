import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  // {
  //   post_id: 1,
  //   user_id: 1,
  //   dorm_id: 1,
  //   category: 'delivery',
  //   title: '맥도날드 배달 같이 하실 분',
  //   content: '광교관 앞 19:30 배달비 n빵합니다.',
  //   price: 12000,
  //   status: 'active',
  //   created_at: '2025-02-01T12:00:00Z',
  //   user: { name: '김슬기', dorm_id: 1 },
  // },
  // {
  //   post_id: 2,
  //   user_id: 2,
  //   dorm_id: 2,
  //   category: 'delivery',
  //   title: '치킨 반반 나눠요 (남제관)',
  //   content: '남제관 입구 근처에서 양념/후라이드 반반, 4명 모집.',
  //   price: 18000,
  //   status: 'active',
  //   created_at: '2025-02-02T09:30:00Z',
  //   user: { name: '박민수', dorm_id: 2 },
  // },
]

export function DeliveryBoard() {
  const { dormId } = useParams<{ dormId: string }>()
  const { user, isLoading } = useAuth()

  // 🔍 디버깅 로그 추가
  console.log('🔍 dormId from URL:', dormId)
  console.log('🔍 user:', user)
  console.log('🔍 user.dorm_id:', user?.dorm_id)
  console.log('🔍 Number(dormId):', Number(dormId))
  console.log('🔍 isLoading:', isLoading)

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return <div>로딩중...</div>
  }

  // 사용자 정보가 없으면 로그인 페이지로
  if (!user) {
    console.log('❌ No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // dormId가 없으면 사용자의 기숙사로 리다이렉트
  if (!dormId) {
    console.log('❌ No dormId, redirecting to user dorm')
    return <Navigate to={`/board/${user.dorm_id}/delivery`} replace />
  }

  // dormId와 user.dorm_id가 일치하지 않으면 권한 없음 페이지로
  if (Number(dormId) !== user.dorm_id) {
    console.log('❌ Unauthorized: dormId mismatch')
    console.log('   URL dormId:', Number(dormId))
    console.log('   User dormId:', user.dorm_id)
    return <Navigate to="/unauthorized" replace />
  }
  console.log('✅ Authorization passed')
  return <BoardPageTemplate title="배달 N빵 게시판" category="delivery" posts={posts} />
}

export default DeliveryBoard
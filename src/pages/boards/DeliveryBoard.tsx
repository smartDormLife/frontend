import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  {
    post_id: 1,
    user_id: 1,
    dorm_id: 1,
    category: 'delivery',
    title: '맥도날드 배달 같이 하실 분',
    content: '광교관 앞 19:30 배달비 n빵합니다.',
    price: 12000,
    status: 'active',
    created_at: '2025-02-01T12:00:00Z',
    user: { name: '김슬기', dorm_id: 1 },
  },
  {
    post_id: 2,
    user_id: 2,
    dorm_id: 2,
    category: 'delivery',
    title: '치킨 반반 나눠요 (남제관)',
    content: '남제관 입구 근처에서 양념/후라이드 반반, 4명 모집.',
    price: 18000,
    status: 'active',
    created_at: '2025-02-02T09:30:00Z',
    user: { name: '박민수', dorm_id: 2 },
  },
]

export function DeliveryBoard() {
  return <BoardPageTemplate title="배달 N빵 게시판" category="delivery" posts={posts} />
}

export default DeliveryBoard

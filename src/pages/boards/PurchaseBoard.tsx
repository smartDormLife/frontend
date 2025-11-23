import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  {
    post_id: 11,
    user_id: 3,
    dorm_id: 1,
    category: 'purchase',
    title: '텀블러 공동구매 5명',
    content: '스탠리 텀블러 공구합니다. 색상 모아서 주문 예정.',
    price: 25000,
    status: 'active',
    created_at: '2025-02-03T10:00:00Z',
    user: { name: '이도현', dorm_id: 1 },
  },
  {
    post_id: 12,
    user_id: 4,
    dorm_id: 1,
    category: 'used_sale',
    title: '전기포트 중고 판매',
    content: '거의 새 것, 1만원. 광교관 로비 직거래 원합니다.',
    price: 10000,
    status: 'active',
    created_at: '2025-02-04T08:30:00Z',
    user: { name: '최하늘', dorm_id: 1 },
  },
]

export function PurchaseBoard() {
  return <BoardPageTemplate title="공구/중고 거래 게시판" category="purchase" posts={posts} />
}

export default PurchaseBoard

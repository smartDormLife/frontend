import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  {
    post_id: 21,
    user_id: 5,
    dorm_id: 1,
    category: 'used_sale',
    title: '책상 스탠드 판매',
    content: 'LED 스탠드 만원에 팔아요. 상태 좋습니다.',
    price: 10000,
    status: 'active',
    created_at: '2025-02-05T09:00:00Z',
    user: { name: '김우진', dorm_id: 1 },
  },
  {
    post_id: 22,
    user_id: 6,
    dorm_id: 1,
    category: 'used_sale',
    title: '교양책 팝니다',
    content: '인문학 교양책 세트 5천원에 정리합니다.',
    price: 5000,
    status: 'active',
    created_at: '2025-02-05T11:10:00Z',
    user: { name: '한서윤', dorm_id: 1 },
  },
]

export function UsedSaleBoard() {
  return <BoardPageTemplate title="중고 거래 게시판" category="used_sale" posts={posts} />
}

export default UsedSaleBoard

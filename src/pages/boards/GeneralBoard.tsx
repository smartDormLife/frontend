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
  return <BoardPageTemplate title="자유게시판" category="general" posts={posts} />
}

export default GeneralBoard

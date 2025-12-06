import { BoardPageTemplate } from './BoardPageTemplate'
import type { Post } from '../../types'

const posts: Post[] = [
  // {
  //   post_id: 201,
  //   user_id: 21,
  //   dorm_id: null,
  //   category: 'taxi',
  //   title: '수원역 택시 n빵 3명 구함',
  //   content: '오늘 21:00, 광교관 앞 집결해서 수원역 이동합니다.',
  //   price: null,
  //   status: 'active',
  //   created_at: '2025-02-02T08:15:00Z',
  //   user: { name: '김지후', dorm_id: null },
  //   party: { party_id: 1, post_id: 201, host_id: 21, location: '광교관 앞', deadline: null, max_member: 4, status: 'recruiting', created_at: '2025-02-01T08:00:00Z', current_member_count: 1 },
  // },
  // {
  //   post_id: 202,
  //   user_id: 22,
  //   dorm_id: null,
  //   category: 'taxi',
  //   title: '인계동 카페 거리 택시 같이 타요',
  //   content: '토요일 오후 2시 출발, 2명 더 구합니다.',
  //   price: null,
  //   status: 'active',
  //   created_at: '2025-02-03T07:40:00Z',
  //   user: { name: '문소연', dorm_id: null },
  //   party: { party_id: 2, post_id: 202, host_id: 22, location: '기숙사 앞', deadline: null, max_member: 3, status: 'recruiting', created_at: '2025-02-02T07:00:00Z', current_member_count: 1 },
  // },
]

export function TaxiBoard() {
  return <BoardPageTemplate title="택시 N빵 게시판" category="taxi" posts={posts} />
}

export default TaxiBoard

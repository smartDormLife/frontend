import { BoardTemplate, type BoardPost } from './BoardTemplate'

const posts: BoardPost[] = [
  {
    id: 21,
    title: '수원역 택시 n빵 3명 구함',
    preview: '오늘 21:00, 광교관 앞 집결해서 수원역 이동합니다.',
    author: '김지후',
    date: '2025-02-02T08:15:00Z',
  },
  {
    id: 22,
    title: '인계동 카페 거리 택시 같이 타요',
    preview: '토요일 오후 2시 출발, 2명 더 구합니다.',
    author: '문소연',
    date: '2025-02-03T07:40:00Z',
  },
]

export function TaxiBoard() {
  return <BoardTemplate title="택시 N빵 게시판" posts={posts} />
}

export default TaxiBoard

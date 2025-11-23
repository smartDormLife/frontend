import { BoardTemplate, type BoardPost } from './BoardTemplate'

const posts: BoardPost[] = [
  {
    id: 31,
    title: '시험 기간 스터디원 모집',
    preview: '자료구조/운영체제 같이 스터디하실 분 3명만 받아요.',
    author: '정유나',
    date: '2025-02-01T13:20:00Z',
  },
  {
    id: 32,
    title: '기숙사 내 택배 보관 주의',
    preview: '최근 분실 사례 있어요. 무인택배함 이용하세요!',
    author: '안태윤',
    date: '2025-02-02T11:00:00Z',
  },
]

export function FreeBoard() {
  return <BoardTemplate title="자유게시판" posts={posts} />
}

export default FreeBoard

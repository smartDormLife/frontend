import { BoardTemplate, type BoardPost } from './BoardTemplate'

const posts: BoardPost[] = [
  {
    id: 11,
    title: '탭탭 벌크 구매 5인 구함',
    preview: '필기구 공동구매합니다. 5명 채우면 무료배송!',
    author: '이도현',
    date: '2025-02-02T10:00:00Z',
  },
  {
    id: 12,
    title: '전기포트 중고 판매',
    preview: '거의 새 것, 1만원. 광교관 로비 직거래 원합니다.',
    author: '최하늘',
    date: '2025-02-01T16:45:00Z',
  },
]

export function GroupBuyBoard() {
  return <BoardTemplate title="공구/중고 거래 게시판" posts={posts} />
}

export default GroupBuyBoard

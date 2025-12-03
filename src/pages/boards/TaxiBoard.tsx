import { BoardPageTemplate } from './BoardPageTemplate'
import { useQuery } from '@tanstack/react-query'
import { postApi } from '../../api/postApi'
import { useAuth } from '../../hooks/useAuth'

export function TaxiBoard() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'taxi'],
    queryFn: () =>
      postApi.list({
        category: 'taxi',
        dorm_id: null, // ⭐ 택시는 dorm_id null로 고정
        status: 'active'
      }),
  })

  const posts = data?.posts ?? []

  return (
    <BoardPageTemplate
      title="택시 N빵 게시판"
      category="taxi"
      posts={posts}
      isLoading={isLoading}
    />
  )
}

export default TaxiBoard

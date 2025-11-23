import type { Post } from '../../types'
import { PostCard } from './PostCard'
import { Skeleton } from '../common/Skeleton'
import { Card } from '../common/Card'

interface PostListProps {
  posts?: Post[]
  isLoading?: boolean
  onSelect?: (postId: number) => void
}

export function PostList({ posts = [], isLoading, onSelect }: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return <Card className="text-center text-surface-600">아직 게시글이 없어요. 첫 글을 작성해 주세요!</Card>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.post_id} post={post} onClick={onSelect} />
      ))}
    </div>
  )
}

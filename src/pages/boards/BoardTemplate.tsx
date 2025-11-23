import { useMemo, useState } from 'react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'

export interface BoardPost {
  id: number
  title: string
  preview: string
  author: string
  date: string // ISO
}

interface BoardTemplateProps {
  title: string
  posts: BoardPost[]
  onCreate?: () => void
}

export function BoardTemplate({ title, posts, onCreate }: BoardTemplateProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return posts
    const q = query.toLowerCase()
    return posts.filter(
      (post) => post.title.toLowerCase().includes(q) || post.preview.toLowerCase().includes(q),
    )
  }, [posts, query])

  return (
    <div className="relative space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-surface-500">커뮤니티 게시판</p>
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        </div>
        <div className="w-full sm:w-80">
          <Input
            placeholder="제목, 내용 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {filtered.map((post) => (
          <Card key={post.id} className="flex flex-col gap-2 border border-surface-100">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-surface-900">{post.title}</h3>
              <p className="line-clamp-2 text-sm text-surface-600">{post.preview}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-surface-500">
              <span>{post.author}</span>
              <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
            </div>
          </Card>
        ))}
        {!filtered.length && (
          <Card className="border border-dashed border-surface-200 text-center text-sm text-surface-600">
            게시글이 없습니다. 첫 글을 작성해 보세요!
          </Card>
        )}
      </section>

      <Button
        className="fixed bottom-8 right-8 shadow-lg"
        size="lg"
        onClick={onCreate ?? (() => alert('글쓰기 버튼'))}
      >
        글쓰기
      </Button>
    </div>
  )
}

export default BoardTemplate

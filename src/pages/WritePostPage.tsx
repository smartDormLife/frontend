import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState, useEffect } from 'react'
import { Input } from '../components/common/Input'
import { Textarea } from '../components/common/Textarea'
import { Button } from '../components/common/Button'
import axiosInstance from '../api/axiosInstance'
import type { PostCategory } from '../types'
import { useAuth } from '../hooks/useAuth'
import { postApi } from '../api/postApi'

export function WritePostPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const category = (params.get('category') as PostCategory) || 'general'
  const dormId = params.get('dormId')
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [maxMember, setMaxMember] = useState(2)
  const [deadline, setDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const postId = params.get('postId')

  const detailQuery = useQuery({
    queryKey: ['writePost', postId],
    queryFn: () => postApi.detail(Number(postId)),
    enabled: Boolean(postId),
  })

  useEffect(() => {
    if (detailQuery.data) {
      setTitle(detailQuery.data.title)
      setContent(detailQuery.data.content)
      if (detailQuery.data.max_member) setMaxMember(detailQuery.data.max_member)
      if (detailQuery.data.party?.deadline) setDeadline(detailQuery.data.party.deadline)
      if (detailQuery.data.party?.location) setLocation(detailQuery.data.party.location)
      if (detailQuery.data.price != null) setPrice(detailQuery.data.price)
    }
  }, [detailQuery.data])

  const isPartyCategory = useMemo(
    () => ['delivery', 'purchase', 'taxi'].includes(category),
    [category],
  )
  const isScheduleCategory = useMemo(
    () => ['delivery', 'taxi'].includes(category),
    [category],
  )
  const isPriceCategory = useMemo(
    () => (detailQuery.data?.category ?? category) === 'used_sale',
    [category, detailQuery.data?.category],
  )

  const mutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, unknown> = {
        title,
        content,
        category: detailQuery.data?.category ?? category,
        dorm_id: dormId ? Number(dormId) : detailQuery.data?.dorm_id ?? user?.dorm_id ?? null,
      }
      if (isPartyCategory || detailQuery.data?.party) {
        body.max_member = maxMember
        if (isScheduleCategory) {
          body.deadline = deadline || null
          body.location = location || null
        }
      }
      if (isPriceCategory) {
        body.price = price === '' ? null : Number(price)
      }
      if (postId) {
        await axiosInstance.patch(`/posts/${postId}`, body)
      } else {
        await axiosInstance.post('/posts', body)
      }
    },
    onSuccess: () => {
      const targetCategory = detailQuery.data?.category ?? category
      if (targetCategory === 'taxi') {
        navigate('/board/taxi')
      } else {
        const targetDorm = dormId ?? (detailQuery.data?.dorm_id ? String(detailQuery.data.dorm_id) : user?.dorm_id ? String(user?.dorm_id) : '1')
        navigate(`/board/${targetDorm}/${targetCategory}`)
      }
    },
  })

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-surface-900">글 작성</h1>
        <p className="text-sm text-surface-600">카테고리: {detailQuery.data?.category ?? category}</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-surface-800">제목</p>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" />
        </div>
        {isPriceCategory && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-800">가격</p>
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
              placeholder="예: 10000"
            />
          </div>
        )}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-surface-800">내용</p>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="내용을 입력하세요"
          />
        </div>
        {isPartyCategory && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-800">최대 인원수 (2~20명)</p>
            <Input
              type="number"
              min={2}
              max={20}
              value={maxMember}
              onChange={(e) => {
                const val = Math.max(2, Math.min(20, Number(e.target.value)))
                setMaxMember(val)
              }}
            />
            {isScheduleCategory && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-surface-800">마감 시간</p>
                  <Input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-surface-800">장소</p>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: 광교관 1층 로비"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
            disabled={!title.trim() || !content.trim()}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WritePostPage

import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'  // ✅ useQueryClient 추가
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
  const queryClient = useQueryClient()  // ✅ 추가
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
  const [subCategory, setSubCategory] = useState<PostCategory>(
    category === 'used_sale' ? 'used_sale' : category === 'purchase' ? 'purchase' : category,
  )

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
      if (detailQuery.data.category) setSubCategory(detailQuery.data.category)
    }
  }, [detailQuery.data])

  const effectiveCategory = subCategory
  const isPartyCategory = useMemo(
    () => ['delivery', 'purchase', 'taxi'].includes(effectiveCategory),
    [effectiveCategory],
  )
  const isScheduleCategory = useMemo(
    () => ['delivery', 'taxi'].includes(effectiveCategory),
    [effectiveCategory],
  )
  const isTaxiCategory = effectiveCategory === 'taxi'
  const isPriceCategory = effectiveCategory === 'used_sale'

  const mutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, unknown> = {
        title,
        content,
        category: effectiveCategory,
        dorm_id: isTaxiCategory
          ? null
          : dormId
            ? Number(dormId)
            : detailQuery.data?.dorm_id ?? user?.dorm_id ?? null,
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

      // ✅ 작성/수정된 게시글 정보 반환
      return {
        category: effectiveCategory,
        dorm_id: body.dorm_id
      }
    },
    onSuccess: (data) => {
      const targetCategory = data.category
      const targetDormId = data.dorm_id

      // ✅ 해당 게시판의 캐시 무효화 (목록 자동 새로고침)
      if (targetCategory === 'taxi') {
        queryClient.invalidateQueries({
          queryKey: ['boardPosts', 'taxi']
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ['boardPosts', targetCategory, targetDormId]
        })
      }
      queryClient.invalidateQueries({ queryKey: ['myPosts'] })

      // ✅ 게시판으로 이동
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
        <p className="text-sm text-surface-600">카테고리: {effectiveCategory}</p>
      </div>
      <div className="space-y-4">
        {(category === 'purchase' || category === 'used_sale' || effectiveCategory === 'purchase' || effectiveCategory === 'used_sale') && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-800">구분</p>
            <select
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-800 shadow-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              value={effectiveCategory}
              onChange={(e) => setSubCategory(e.target.value as PostCategory)}
            >
              <option value="purchase">공구</option>
              <option value="used_sale">중고</option>
            </select>
          </div>
        )}
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
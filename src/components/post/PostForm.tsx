import { useState } from 'react'
import type { Dormitory, PostCategory } from '../../types'
import { Input } from '../common/Input'
import { Textarea } from '../common/Textarea'
import { Button } from '../common/Button'
import { Select } from '../common/Select'

export interface PostFormValues {
  dorm_id: number
  category: PostCategory
  title: string
  content: string
  price?: number | null
  party?: {
    max_member: number
    deadline?: string | null
    location?: string | null
  }
}

interface PostFormProps {
  dormitories: Dormitory[]
  defaultDormId?: number
  defaultValues?: Partial<PostFormValues>
  onSubmit: (values: PostFormValues) => Promise<void> | void
  isSubmitting?: boolean
}

const categories: { key: PostCategory; label: string; description: string }[] = [
  { key: 'delivery', label: '배달 n빵', description: '배달비를 나누어 결제해요' },
  { key: 'purchase', label: '공구', description: '여러 명이 함께 구매해요' },
  { key: 'taxi', label: '택시 n빵', description: '택시비를 나누어 이동해요' },
  { key: 'used_sale', label: '중고', description: '중고 거래 및 양도' },
  { key: 'general', label: '자유', description: '자유로운 게시글' },
]

export function PostForm({ dormitories, defaultDormId, defaultValues, onSubmit, isSubmitting }: PostFormProps) {
  const ensureParty = (prev: PostFormValues) =>
    prev.party ?? { max_member: 2, deadline: null, location: '' }

  const [values, setValues] = useState<PostFormValues>({
    dorm_id: defaultDormId ?? dormitories[0]?.dorm_id ?? 0,
    category: defaultValues?.category ?? 'delivery',
    title: defaultValues?.title ?? '',
    content: defaultValues?.content ?? '',
    price: defaultValues?.price ?? null,
    party: defaultValues?.party ?? { max_member: 4, deadline: '', location: '' },
  })

  const isPartyCategory = values.category !== 'general'
  const needsAppointmentTime = values.category === 'delivery' || values.category === 'taxi'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((item) => (
          <label
            key={item.key}
            className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition ${values.category === item.key ? 'border-primary-400 bg-primary-50' : 'border-surface-200 hover:border-primary-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-surface-900">{item.label}</p>
                <p className="text-sm text-surface-600">{item.description}</p>
              </div>
              <input
                type="radio"
                name="category"
                value={item.key}
                checked={values.category === item.key}
                onChange={() => setValues((prev) => ({ ...prev, category: item.key }))}
                className="h-5 w-5"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-surface-800">기숙사</p>
          <Select
            value={values.dorm_id}
            onChange={(e) => setValues((prev) => ({ ...prev, dorm_id: Number(e.target.value) }))}
          >
            {dormitories.map((dorm) => (
              <option key={dorm.dorm_id} value={dorm.dorm_id}>
                {dorm.dorm_name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-surface-800">가격(선택)</p>
          <Input
            type="number"
            placeholder="가격 입력"
            value={values.price ?? ''}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, price: e.target.value ? Number(e.target.value) : null }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-surface-800">제목</p>
        <Input
          required
          placeholder="제목을 입력하세요"
          value={values.title}
          onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-surface-800">내용</p>
        <Textarea
          required
          rows={6}
          placeholder="상세 내용을 적어주세요"
          value={values.content}
          onChange={(e) => setValues((prev) => ({ ...prev, content: e.target.value }))}
        />
      </div>

      {isPartyCategory && (
        <div className="grid gap-4 rounded-2xl bg-surface-50 p-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-800">모집 인원</p>
            <Input
              type="number"
              min={2}
              value={values.party?.max_member ?? ''}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                party: { ...ensureParty(prev), max_member: Number(e.target.value) },
              }))
            }
            required
          />
          </div>
          {needsAppointmentTime && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-surface-800">약속시간</p>
              <Input
                type="datetime-local"
                value={values.party?.deadline ?? ''}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  party: { ...ensureParty(prev), deadline: e.target.value || null },
                }))
              }
            />
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-surface-800">만날 장소</p>
            <Input
              placeholder="예: 광교관 1층 로비"
              value={values.party?.location ?? ''}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                party: { ...ensureParty(prev), location: e.target.value },
              }))
            }
          />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          게시글 등록
        </Button>
      </div>
    </form>
  )
}

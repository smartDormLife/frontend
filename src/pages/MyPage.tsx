import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import { useUser } from '../hooks/useUser'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/common/Card'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { NavTabs } from '../components/layout/NavTabs'
import { PostList } from '../components/post/PostList'
import type { PostCategory } from '../types'

export function MyPage() {
  const { data: profile } = useUser()
  const { setUser } = useAuth()
  const [form, setForm] = useState<{ room_no: string; phone: string; account_number: string }>({
    room_no: '',
    phone: '',
    account_number: '',
  })
  const [postCategory, setPostCategory] = useState<PostCategory | 'all'>('all')

  useEffect(() => {
    if (profile) {
      setForm({
        room_no: profile.room_no ?? '',
        phone: profile.phone ?? '',
        account_number: profile.account_number ?? '',
      })
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (updated) => setUser(updated),
  })

  const myPostsQuery = useQuery({
    queryKey: ['myPosts', postCategory],
    queryFn: () =>
      userApi.myPosts({ category: postCategory === 'all' ? undefined : (postCategory as PostCategory) }),
  })

  const myPartiesQuery = useQuery({ queryKey: ['myParties'], queryFn: userApi.myParties })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-surface-500">내 정보</p>
        <h1 className="text-2xl font-bold text-surface-900">마이페이지</h1>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-surface-500">프로필</p>
            <p className="text-lg font-semibold">{profile?.name}</p>
            <p className="text-sm text-surface-600">{profile?.email}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => updateMutation.mutate({
              room_no: form.room_no,
              phone: form.phone,
              account_number: form.account_number,
            })}
            isLoading={updateMutation.isPending}
          >
            저장
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="호실"
            value={form.room_no}
            onChange={(e) => setForm((prev) => ({ ...prev, room_no: e.target.value }))}
          />
          <Input
            placeholder="전화번호"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            placeholder="계좌번호"
            value={form.account_number}
            onChange={(e) => setForm((prev) => ({ ...prev, account_number: e.target.value }))}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900">내가 작성한 글</h2>
        </div>
        <NavTabs activeCategory={postCategory} onChange={(c) => setPostCategory(c)} />
        <PostList posts={myPostsQuery.data?.items} isLoading={myPostsQuery.isLoading} />
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-surface-900">참여 중인 파티</h2>
        </div>
        <PostList posts={myPartiesQuery.data?.items} isLoading={myPartiesQuery.isLoading} />
      </Card>
    </div>
  )
}

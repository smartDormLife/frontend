import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { UserInfoCard } from '../components/profile/UserInfoCard'
import type { UserProfile } from '../types'

export function MyPage() {
  const { user } = useAuth()
  const profileQuery = useQuery<UserProfile>({
    queryKey: ['myProfile'],
    queryFn: userApi.profile,
    enabled: Boolean(user),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-surface-500">내 정보</p>
        <h1 className="text-2xl font-bold text-surface-900">마이페이지</h1>
      </div>

      {profileQuery.isLoading && <Card><EmptyState title="불러오는 중" description="잠시만 기다려 주세요." /></Card>}
      {profileQuery.data && <UserInfoCard profile={profileQuery.data} />}
      {!profileQuery.isLoading && !profileQuery.data && (
        <Card><EmptyState title="내 정보를 불러오지 못했어요" description="로그인을 확인해주세요." /></Card>
      )}
    </div>
  )
}

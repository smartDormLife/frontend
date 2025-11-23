import { Card } from '../common/Card'
import type { UserProfile } from '../../types'

interface UserInfoCardProps {
  title?: string
  profile: UserProfile
}

export function UserInfoCard({ title = '내 정보', profile }: UserInfoCardProps) {
  const fields: { label: string; value: string }[] = [
    { label: '이름', value: profile.name },
    { label: '이메일', value: profile.email },
    { label: '기숙사', value: profile.dorm_name },
    { label: '방 번호', value: profile.room_no || '미입력' },
    { label: '전화번호', value: profile.phone || '미입력' },
  ]

  return (
    <Card className="space-y-4 bg-white shadow-md">
      <h2 className="text-lg font-bold text-surface-900">{title}</h2>
      <div className="divide-y divide-surface-100">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-surface-600">{field.label}</span>
            <span className="text-sm text-surface-900">{field.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default UserInfoCard

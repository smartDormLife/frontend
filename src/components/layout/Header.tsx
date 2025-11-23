import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { DormSelector } from './DormSelector'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { dormApi } from '../../api/dormApi'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: dorms } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list, staleTime: 1000 * 60 * 5 })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-surface-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg">
            <span className="text-lg font-bold">G</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-700">슬기로운</p>
            <p className="-mt-1 text-lg font-bold text-surface-900">긱사생활</p>
          </div>
        </Link>

        <DormSelector />

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex min-w-[180px] flex-col rounded-xl border border-primary-100 bg-primary-50/90 px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold text-primary-700">내정보</p>
                <p className="text-sm font-semibold text-surface-900">{user.name}</p>
                <p className="text-xs text-surface-600">{user.email}</p>
                <p className="text-xs text-surface-600">
                  {dorms?.find((d) => d.dorm_id === user.dorm_id)?.dorm_name ?? `dorm #${user.dorm_id || '-'}`} / {user.room_no || '호실 정보 없음'}
                </p>
              </div>
              <Button
                size="sm"
                className="rounded-lg bg-[#E8F1FF] px-3.5 py-2 text-sm font-medium text-primary-700 hover:bg-[#d9e8ff]"
                onClick={() => navigate('/mypage')}
              >
                내정보
              </Button>
              <span className="hidden text-sm text-surface-600 sm:inline">{user.name}님 환영해요</span>
              <Button variant="secondary" size="sm" onClick={() => navigate('/mypage')}>
                마이페이지
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

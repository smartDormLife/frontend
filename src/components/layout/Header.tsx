import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useUnreadChatCount } from '../../hooks/useUnreadChatCount'
import { useChatNotifications } from '../../hooks/useChatNotifications'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { hasUnread } = useUnreadChatCount()

  // 헤더에서도 실시간 채팅 알림 수신
  useChatNotifications(true)

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

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/mypage')}
              >
                마이페이지
              </Button>
              <button
                onClick={() => navigate('/chat')}
                className="relative rounded-lg px-3 py-2 text-sm font-medium text-surface-600 transition hover:bg-surface-50 hover:text-primary-700"
              >
                채팅
                {hasUnread && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-lg">
                    NEW
                  </span>
                )}
              </button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
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

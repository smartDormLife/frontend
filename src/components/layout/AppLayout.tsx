import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'

export function AppLayout() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen text-surface-900">
      {!isAuthPage && <Header />}
      <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

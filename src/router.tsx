import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { BoardPage } from './pages/BoardPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { PostCreatePage } from './pages/PostCreatePage'
import { MyPage } from './pages/MyPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dorm/:dormId" element={<BoardPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

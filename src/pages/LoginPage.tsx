import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const mutation = useMutation({
    mutationFn: () => login(form),
    onSuccess: () => navigate('/'),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50 px-4 py-12">
      <Card className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-primary-600">슬기로운 긱사생활</p>
          <h1 className="text-2xl font-bold text-surface-900">로그인</h1>
          <p className="text-sm text-surface-600">배달/공구/택시/중고 파티에 참여해 보세요.</p>
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <Button onClick={() => mutation.mutate()} isLoading={mutation.isPending} className="w-full">
            로그인
          </Button>
        </div>
        <p className="text-center text-sm text-surface-600">
          계정이 없으신가요? <Link to="/register" className="text-primary-600">회원가입</Link>
        </p>
      </Card>
    </div>
  )
}

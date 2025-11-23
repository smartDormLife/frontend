import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Select } from '../components/common/Select'
import { dormApi } from '../api/dormApi'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { data: dorms = [] } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    dorm_id: 0,
    room_no: '',
    phone: '',
  })

  useEffect(() => {
    if (dorms.length && form.dorm_id === 0) {
      setForm((prev) => ({ ...prev, dorm_id: dorms[0].dorm_id }))
    }
  }, [dorms, form.dorm_id])

  const mutation = useMutation({
    mutationFn: () => register(form),
    onSuccess: () => navigate('/'),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-surface-50 via-white to-primary-50 px-4 py-12">
      <Card className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-primary-600">슬기로운 긱사생활</p>
          <h1 className="text-2xl font-bold text-surface-900">회원가입</h1>
          <p className="text-sm text-surface-600">기숙사 정보를 입력하고 시작하세요.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            placeholder="이메일"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Input
            placeholder="비밀번호"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <Input
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Select
            value={form.dorm_id}
            onChange={(e) => setForm((prev) => ({ ...prev, dorm_id: Number(e.target.value) }))}
          >
            {dorms.map((dorm) => (
              <option key={dorm.dorm_id} value={dorm.dorm_id}>
                {dorm.dorm_name}
              </option>
            ))}
          </Select>
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
        </div>

        <Button onClick={() => mutation.mutate()} isLoading={mutation.isPending} className="w-full">
          가입하기
        </Button>

        <p className="text-center text-sm text-surface-600">
          이미 계정이 있나요? <Link to="/login" className="text-primary-600">로그인</Link>
        </p>
      </Card>
    </div>
  )
}

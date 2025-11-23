import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center">
      <Card className="mt-12 w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-surface-900">접근할 수 없습니다</h1>
        <p className="mt-2 text-sm text-surface-600">당신은 이 기숙사 게시판을 볼 수 없습니다.</p>
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => navigate('/')}>메인으로 돌아가기</Button>
        </div>
      </Card>
    </div>
  )
}

export default UnauthorizedPage

import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { dormApi } from '../../api/dormApi'
import { Select } from '../common/Select'

export function DormSelector() {
  const navigate = useNavigate()
  const { dormId } = useParams()

  const { data, isLoading, isError } = useQuery({ queryKey: ['dormitories'], queryFn: dormApi.list })

  const handleChange = (value: string) => {
    if (!value) return
    navigate(`/dorm/${value}`)
  }

  const options = Array.isArray(data) ? data : []
  const selectedValue = dormId ?? ''

  return (
    <div className="w-52">
      <Select
        disabled={isLoading || isError}
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value)}
        className="pr-9"
      >
        <option value="" disabled>
          기숙사 선택
        </option>
        {options.map((dorm) => (
          <option key={dorm.dorm_id} value={dorm.dorm_id}>
            {dorm.dorm_name}
          </option>
        ))}
      </Select>
    </div>
  )
}

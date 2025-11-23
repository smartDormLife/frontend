import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/userApi'
import { useAuth } from './useAuth'
import type { User } from '../types'

export function useUser() {
  const { token, setUser } = useAuth()

  const query = useQuery<User>({
    queryKey: ['me'],
    queryFn: userApi.me,
    enabled: Boolean(token),
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  return query
}

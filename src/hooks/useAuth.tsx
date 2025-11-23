import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  register: (payload: {
    email: string
    password: string
    name: string
    dorm_id: number
    room_no?: string
    phone?: string
  }) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken')
    const savedUser = localStorage.getItem('user')
    if (savedToken) {
      setToken(savedToken)
    }
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User
        setUser(parsed)
      } catch (error) {
        console.error('Failed to parse saved user', error)
      }
    }
    const bootstrap = async () => {
      if (!savedToken) {
        setIsLoading(false)
        return
      }
      try {
        const me = await authApi.fetchMe()
        setUser(me)
      } catch (error) {
        console.warn('Session expired, clearing auth', error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    bootstrap()
  }, [])

  const persist = (accessToken: string, me: User) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(me))
    setToken(accessToken)
    setUser(me)
  }

  const login = async (payload: { email: string; password: string }) => {
    const data = await authApi.login(payload)
    persist(data.accessToken, data.user)
  }

  const register = async (payload: {
    email: string
    password: string
    name: string
    dorm_id: number
    room_no?: string
    phone?: string
  }) => {
    const data = await authApi.register(payload)
    persist(data.accessToken, data.user)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({ user, token, isLoading, login, logout, register, setUser }),
    [user, token, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

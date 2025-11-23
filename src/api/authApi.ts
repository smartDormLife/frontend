import axiosInstance from './axiosInstance'
import type { AuthResponse, User } from '../types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload extends LoginPayload {
  name: string
  dorm_id: number
  room_no?: string
  phone?: string
}

export const authApi = {
  async login(payload: LoginPayload) {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload)
    return data
  },
  async register(payload: RegisterPayload) {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload)
    return data
  },
  async logout() {
    // Backend may invalidate token; front clears storage in hook.
    await axiosInstance.post('/auth/logout')
  },
  async fetchMe() {
    const { data } = await axiosInstance.get<User>('/users/me')
    return data
  },
}

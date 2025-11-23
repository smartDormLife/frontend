import axiosInstance from './axiosInstance'
import type { PaginatedResponse, Post, User } from '../types'

export interface UpdateProfilePayload extends Partial<Omit<User, 'user_id' | 'created_at' | 'email'>> {}

export const userApi = {
  async me() {
    const { data } = await axiosInstance.get<User>('/users/me')
    return data
  },
  async updateMe(payload: UpdateProfilePayload) {
    const { data } = await axiosInstance.patch<User>('/users/me', payload)
    return data
  },
  async myPosts(params?: { category?: Post['category'] }) {
    const { data } = await axiosInstance.get<PaginatedResponse<Post>>('/users/me/posts', { params })
    return data
  },
  async myParties() {
    const { data } = await axiosInstance.get<PaginatedResponse<Post>>('/users/me/parties')
    return data
  },
}

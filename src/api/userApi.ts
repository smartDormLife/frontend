import axiosInstance from './axiosInstance'
import type { MyComment, PaginatedResponse, Post, User, UserProfile } from '../types'

export type UpdateProfilePayload = Partial<Omit<User, 'user_id' | 'created_at' | 'email'>>

export const userApi = {
  async me() {
    const { data } = await axiosInstance.get<User>('/users/me')
    return data
  },
  async profile() {
    const { data } = await axiosInstance.get<UserProfile>('/users/me')
    return data
  },
  async updateMe(payload: UpdateProfilePayload) {
    const { data } = await axiosInstance.patch<User>('/users/me', payload)
    return data
  },
  async myPosts(params?: { category?: Post['category']; page?: number; size?: number }) {
    const { data } = await axiosInstance.get<PaginatedResponse<Post>>('/users/me/posts', { params })
    return data
  },
  async myComments(params?: { page?: number; size?: number }) {
    const { data } = await axiosInstance.get<PaginatedResponse<MyComment>>('/users/me/comments', { params })
    return data
  },
  async myParties(params?: { page?: number; size?: number }) {
    const { data } = await axiosInstance.get<PaginatedResponse<Post>>('/users/me/parties', { params })
    return data
  },
}

import axiosInstance from './axiosInstance'
import type { Comment, Party, Post, PostQuery } from '../types'

export interface CreatePostPayload {
  dorm_id: number
  category: Post['category']
  title: string
  content: string
  price?: number | null
  max_member?: number | null
  party?: Pick<Party, 'max_member' | 'deadline' | 'location'>
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}

export interface PostListResponse {
  posts: Post[]
  totalCount: number
  page: number
  size: number
}

export const postApi = {
  async list(params?: PostQuery) {
    const { data } = await axiosInstance.get<PostListResponse>('/posts', { params })
    return data
  },
  async detail(postId: number) {
    const { data } = await axiosInstance.get<Post>(`/posts/${postId}`)
    return data
  },
  async create(payload: CreatePostPayload) {
    const { data } = await axiosInstance.post<Post>('/posts', payload)
    return data
  },
  async update(postId: number, payload: UpdatePostPayload) {
    const { data } = await axiosInstance.patch<Post>(`/posts/${postId}`, payload)
    return data
  },
  async remove(postId: number) {
    const { data } = await axiosInstance.delete(`/posts/${postId}`)
    return data
  },
  async listComments(postId: number) {
    const { data } = await axiosInstance.get<Comment[]>(`/posts/${postId}/comments`)
    return data
  },
  async addComment(postId: number, content: string) {
    const { data } = await axiosInstance.post<Comment>(`/posts/${postId}/comments`, { content })
    return data
  },
  async deleteComment(commentId: number) {
    const { data } = await axiosInstance.delete(`/comments/${commentId}`)
    return data
  },
}

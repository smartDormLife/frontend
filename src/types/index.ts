export interface Dormitory {
  dorm_id: number
  dorm_name: string
}

export interface User {
  user_id: number
  email: string
  name: string
  dorm_id: number | null
  room_no: string | null
  phone: string | null
  account_number: string | null
  created_at: string
}

export interface UserProfile {
  name: string
  email: string
  dorm_name: string
  room_no: string | null
  phone: string | null
}

export type PostCategory =
  | 'delivery'
  | 'purchase'
  | 'taxi'
  | 'used_sale'
  | 'general'

export type PostStatus = 'active' | 'closed'

export interface Post {
  post_id: number
  user_id: number
  dorm_id: number | null
  category: PostCategory
  title: string
  content: string
  price: number | null
  status: PostStatus
  created_at: string
  user?: Pick<User, 'name' | 'dorm_id'>
  party?: Party | null
  comment_count?: number
  max_member?: number | null
  current_member_count?: number | null
}

export type PartyStatus = 'recruiting' | 'closed'

export interface Party {
  party_id: number
  post_id: number
  host_id: number
  location: string | null
  deadline: string | null
  max_member: number
  status: PartyStatus
  created_at: string
  current_member_count?: number
  is_joined?: boolean
}

export interface Comment {
  comment_id: number
  post_id: number
  user_id: number
  content: string
  created_at: string
  user?: Pick<User, 'name'>
}

export interface PaginationQuery {
  page?: number
  size?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  size: number
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface PostQuery extends PaginationQuery {
  dorm_id?: number
  category?: PostCategory
  status?: PostStatus
  sort?: 'latest' | 'deadline'
  keyword?: string
}

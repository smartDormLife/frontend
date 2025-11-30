export interface Dormitory {
  dorm_id: number;
  dorm_name: string;
}

export interface User {
  user_id: number;
  email: string;
  name: string;
  dorm_id: number | null;
  room_no: string | null;
  phone: string | null;
  account_number: string | null;
  created_at: string;
}

export interface UserProfile {
  name: string;
  email: string;
  dorm_name: string;
  room_no: string | null;
  phone: string | null;
}

export type PostCategory =
  | "delivery"
  | "purchase"
  | "taxi"
  | "used_sale"
  | "general";

export type PostStatus = "active" | "closed";

export interface Post {
  post_id: number;
  user_id: number;
  dorm_id: number | null;
  dorm_name?: string | null;
  category: PostCategory;
  title: string;
  content: string;
  price: number | null;
  status: PostStatus;
  created_at: string;
  user?: Pick<User, "name" | "dorm_id">;
  party?: Party | null;
  comment_count?: number;
  max_member?: number | null;
  current_member_count?: number | null;
  party_role?: PartyRole;
}

export type PartyStatus = "recruiting" | "closed";

export interface Party {
  party_id: number;
  post_id: number;
  host_id: number;
  location: string | null;
  deadline: string | null;
  max_member: number;
  status: PartyStatus;
  created_at: string;
  current_member_count?: number;
  is_joined?: boolean;
}

export type PartyRole = "host" | "member" | "guest";

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: Pick<User, "name">;
}

export interface PaginationQuery {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  size: number;
}

export interface MyComment extends Comment {
  post: (Pick<Post, "post_id" | "title" | "category" | "status" | "dorm_id" | "dorm_name" | "current_member_count" | "comment_count" | "max_member"> & {
    party?: Party | null;
  }) | null;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface PostQuery extends PaginationQuery {
  dorm_id?: number;
  category?: PostCategory;
  status?: PostStatus;
  sort?: "latest" | "deadline";
  keyword?: string;
}

export interface ChatRoom {
  room_id: number;
  party_id: number;
  created_at: string;
  last_message: string | null;
  party?: Party;
  unread_count?: number;
  member_count?: number;
}

export interface ChatMessage {
  msg_id: number;
  room_id: number;
  sender_id: number;
  content: string;
  timestamp: string;
  sender?: Pick<User, "name">;
  is_mine?: boolean;
}

export interface ChatMember {
  room_id: number;
  user_id: number;
  joined_at: string;
  is_active: boolean;
  user?: Pick<User, "name">;
}

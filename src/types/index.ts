// ── 유저 ──
export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  role: 'user' | 'business' | 'rider' | 'admin';
  university?: string;
  campus?: string;
  department?: string;
  address?: string;
  profile_image?: string;
  points: number;
  is_verified: boolean;
  created_at: string;
}

export interface UserProfile extends User {
  completed_meetings: number;
  badges: BadgeCount[];
}

export interface PublicUser {
  id: number;
  nickname: string;
  department?: string;
  profile_image?: string;
  completed_meetings: number;
  badges: BadgeCount[];
}

export interface BadgeCount {
  badge: 'good' | 'normal' | 'bad';
  count: number;
}

// ── 인증 ──
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    nickname: string;
    role: string;
    university?: string;
    campus?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  department?: string;
  address?: string;
  university?: string;
  campus?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ── 가게 ──
export type StoreCategory =
  | 'korean' | 'chinese' | 'japanese' | 'western'
  | 'chicken' | 'pizza' | 'burger' | 'snack' | 'dessert' | 'etc';

export interface Store {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  category: StoreCategory;
  phone?: string;
  address: string;
  open_time?: string;
  close_time?: string;
  closed_days?: string;
  delivery_fee: number;
  min_order_amount: number;
  thumbnail?: string;
  is_active: boolean;
  created_at: string;
}

export interface StoreDetail extends Store {
  menus: Menu[];
}

// ── 메뉴 ──
export interface Menu {
  id: number;
  store_id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  is_available: boolean;
}

// ── 모임 ──
export type MeetingStatus =
  | 'recruiting' | 'closed' | 'ordered' | 'cooking'
  | 'delivering' | 'delivered' | 'completed' | 'cancelled';

export type DiningType = 'individual' | 'together';
export type OrderType = 'instant' | 'reservation';

export interface Meeting {
  id: number;
  leader_id: number;
  store_id: number;
  title?: string;
  dining_type: DiningType;
  order_type: OrderType;
  pickup_location: string;
  meeting_location?: string;
  min_members: number;
  max_members: number;
  delivery_fee: number;
  allow_early_order: boolean;
  deadline: string;
  description?: string;
  status: MeetingStatus;
  campus?: string;
  created_at: string;
  // Joined fields
  store_name: string;
  store_category: StoreCategory;
  store_thumbnail?: string;
  current_members: number;
  leader_nickname: string;
}

export interface MeetingDetail extends Meeting {
  min_order_amount: number;
  members: MeetingMember[];
  orderItems: OrderItem[];
}

export interface MeetingMember {
  id: number;
  meeting_id: number;
  user_id: number;
  is_leader: boolean;
  joined_at: string;
  nickname: string;
  profile_image?: string;
}

// ── 주문 ──
export type OrderStatus =
  | 'pending' | 'approved' | 'rejected' | 'cooking'
  | 'cooked' | 'delivering' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  meeting_id: number;
  store_id: number;
  total_amount: number;
  delivery_fee: number;
  status: OrderStatus;
  created_at: string;
  // Joined fields
  store_name: string;
  store_thumbnail?: string;
  meeting_title?: string;
  dining_type: DiningType;
}

export interface OrderItem {
  id: number;
  order_id: number;
  user_id: number;
  menu_id: number;
  quantity: number;
  price: number;
  is_shared: boolean;
  menu_name: string;
  orderer_nickname: string;
}

// ── 결제 ──
export interface Payment {
  id: number;
  user_id: number;
  meeting_id: number;
  amount: number;
  delivery_fee_share: number;
  points_used: number;
  method: 'card' | 'point';
  status: 'pending' | 'paid' | 'refunded' | 'cancelled';
  created_at: string;
}

// ── 채팅 ──
export interface ChatRoom {
  id: number;
  meeting_id: number;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  nickname: string;
  message: string;
  created_at: string;
}

// ── 평가 ──
export type BadgeType = 'good' | 'normal' | 'bad';

export interface EvaluationTarget {
  user_id: number;
  nickname: string;
  profile_image?: string;
  already_evaluated: boolean;
}

// ── 문의 ──
export interface Inquiry {
  id: number;
  user_id: number;
  title: string;
  content: string;
  status: 'pending' | 'answered';
  answer?: string;
  answered_at?: string;
  created_at: string;
}

// ── 알림 ──
export type NotificationType = 'meeting' | 'order' | 'payment' | 'delivery' | 'system';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  content?: string;
  is_read: boolean;
  reference_id?: number;
  reference_type?: string;
  created_at: string;
}

// ── 장바구니 ──
export interface CartItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  isShared: boolean;
}

// ── API 응답 ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

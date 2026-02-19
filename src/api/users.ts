import client from './client';
import type { ApiResponse, UserProfile, PublicUser, Order } from '@/types';

export const usersApi = {
  getProfile: () =>
    client.get<ApiResponse<UserProfile>>('/users/me'),

  updateProfile: (data: { currentPassword: string; nickname?: string; profileImage?: string }) =>
    client.put<ApiResponse>('/users/me', data),

  deleteAccount: (password: string) =>
    client.delete<ApiResponse>('/users/me', { data: { password } }),

  getOrderHistory: (page = 1, limit = 10) =>
    client.get<ApiResponse<Order[]>>('/users/me/orders', { params: { page, limit } }),

  getUserInfo: (id: number) =>
    client.get<ApiResponse<PublicUser>>(`/users/${id}`),
};

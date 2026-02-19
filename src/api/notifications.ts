import client from './client';
import type { ApiResponse, Notification } from '@/types';

export const notificationsApi = {
  getAll: () =>
    client.get<ApiResponse<Notification[]>>('/notifications'),

  markAsRead: (id: number) =>
    client.put<ApiResponse>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    client.put<ApiResponse>('/notifications/read-all'),
};

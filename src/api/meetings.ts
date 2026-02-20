import client from './client';
import type { ApiResponse, Meeting, MeetingDetail } from '@/types';

interface CreateMeetingRequest {
  storeId: number;
  title?: string;
  diningType: 'individual' | 'together';
  orderType: 'instant' | 'reservation';
  pickupLocation: string;
  meetingLocation?: string;
  minMembers: number;
  maxMembers: number;
  deliveryFee: number;
  allowEarlyOrder: boolean;
  deadline: string;
  description?: string;
  campus?: string;
}

interface JoinMeetingRequest {
  menuItems: { menuId: number; quantity: number; isShared: boolean }[];
  pointsUsed?: number;
}

export const meetingsApi = {
  list: (params?: { campus?: string; category?: string; sort?: string; status?: string; page?: number; limit?: number }) =>
    client.get<ApiResponse<Meeting[]>>('/meetings', { params }),

  getById: (id: number) =>
    client.get<ApiResponse<MeetingDetail>>(`/meetings/${id}`),

  create: (data: CreateMeetingRequest) =>
    client.post<ApiResponse<{ id: number }>>('/meetings', data),

  join: (id: number, data: JoinMeetingRequest) =>
    client.post<ApiResponse>(`/meetings/${id}/join`, data),

  processOrder: (id: number) =>
    client.post<ApiResponse>(`/meetings/${id}/order`),

  complete: (id: number) =>
    client.post<ApiResponse<{ refundPerPerson: number }>>(`/meetings/${id}/complete`),

  cancelMenuItem: (orderItemId: number) =>
    client.delete<ApiResponse>(`/meetings/order-items/${orderItemId}`),
};

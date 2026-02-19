import client from './client';
import type { ApiResponse, Inquiry } from '@/types';

export const inquiriesApi = {
  create: (data: { title: string; content: string }) =>
    client.post<ApiResponse>('/inquiries', data),

  getMyList: () =>
    client.get<ApiResponse<Inquiry[]>>('/inquiries/my'),

  getById: (id: number) =>
    client.get<ApiResponse<Inquiry>>(`/inquiries/${id}`),
};

import client from './client';
import type { ApiResponse, Store, StoreDetail } from '@/types';

export const storesApi = {
  list: (params?: { category?: string; page?: number; limit?: number }) =>
    client.get<ApiResponse<Store[]>>('/stores', { params }),

  getById: (id: number) =>
    client.get<ApiResponse<StoreDetail>>(`/stores/${id}`),
};

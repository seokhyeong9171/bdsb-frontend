import client from './client';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export const authApi = {
  register: (data: RegisterRequest) =>
    client.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginRequest) =>
    client.post<ApiResponse<AuthResponse>>('/auth/login', data),
};

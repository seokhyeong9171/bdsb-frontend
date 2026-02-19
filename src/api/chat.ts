import client from './client';
import type { ApiResponse, ChatRoom, ChatMessage } from '@/types';

export const chatApi = {
  getRoom: (meetingId: number) =>
    client.get<ApiResponse<ChatRoom>>(`/chat/meeting/${meetingId}`),

  getMessages: (roomId: number, params?: { page?: number; limit?: number }) =>
    client.get<ApiResponse<ChatMessage[]>>(`/chat/room/${roomId}/messages`, { params }),

  sendMessage: (roomId: number, message: string) =>
    client.post<ApiResponse<ChatMessage>>(`/chat/room/${roomId}/messages`, { message }),
};

import client from './client';
import type { ApiResponse, EvaluationTarget, BadgeType } from '@/types';

export const evaluationsApi = {
  getTargets: (meetingId: number) =>
    client.get<ApiResponse<EvaluationTarget[]>>(`/evaluations/${meetingId}/targets`),

  submit: (meetingId: number, evaluations: { targetId: number; badge: BadgeType }[]) =>
    client.post<ApiResponse>(`/evaluations/${meetingId}`, { evaluations }),
};

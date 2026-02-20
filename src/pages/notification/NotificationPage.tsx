import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { notificationsApi } from '@/api/notifications';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { Notification } from '@/types';

const typeIcon: Record<string, string> = {
  meeting: '👥',
  order: '📋',
  payment: '💳',
  delivery: '🚗',
  system: '🔔',
};

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export default function NotificationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationsApi.getAll();
      // 백엔드 응답: { success: true, data: { notifications: [...], unreadCount: N } }
      const raw = res.data.data;
      if (Array.isArray(raw)) return raw as Notification[];
      const typed = raw as unknown as NotificationsResponse;
      return typed?.notifications ?? [];
    },
  });

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      // 에러 무시
    }
  };

  const handleMarkOne = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch {
      // 에러 무시
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="알림"
        right={
          <button onClick={handleMarkAll} className="text-xs text-primary font-medium">
            모두 읽음
          </button>
        }
      />
      <div className="page-container">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <EmptyState message="알림을 불러올 수 없어요" sub="잠시 후 다시 시도해주세요." />
        ) : !data || data.length === 0 ? (
          <EmptyState message="알림이 없어요" />
        ) : (
          <div className="space-y-2">
            {data.map((noti) => (
              <button
                key={noti.id}
                onClick={() => handleMarkOne(noti.id)}
                className={`w-full text-left p-4 rounded-xl transition-colors ${
                  noti.is_read ? 'bg-white' : 'bg-primary-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{typeIcon[noti.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${noti.is_read ? 'text-gray-300' : 'font-medium text-gray-900'}`}>
                      {noti.title}
                    </p>
                    {noti.content && (
                      <p className="text-xs text-gray-200 mt-0.5 line-clamp-2">{noti.content}</p>
                    )}
                    <p className="text-xs text-gray-200 mt-1">
                      {formatDistanceToNow(new Date(noti.created_at), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  {!noti.is_read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { usersApi } from '@/api/users';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { Order } from '@/types';

const statusLabel: Record<string, string> = {
  pending: '대기중', approved: '승인', rejected: '거절', cooking: '조리중',
  cooked: '조리완료', delivering: '배달중', delivered: '배달완료',
  completed: '완료', cancelled: '취소',
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      const res = await usersApi.getOrderHistory();
      return res.data.data as Order[];
    },
  });

  return (
    <div className="min-h-screen">
      <Header title="주문 내역" showBack={false} />
      <div className="page-container">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data || data.length === 0 ? (
          <EmptyState message="주문 내역이 없어요" sub="모임에 참여해보세요!" />
        ) : (
          <div className="space-y-3">
            {data.map((order) => (
              <button
                key={order.id}
                onClick={() => navigate(`/meetings/${order.meeting_id}`)}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 active:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {order.store_thumbnail ? (
                    <img src={order.store_thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold truncate">{order.store_name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                        order.status === 'completed' ? 'bg-green-50 text-green-600' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                        'bg-primary-50 text-primary'
                      }`}>
                        {statusLabel[order.status] || order.status}
                      </span>
                    </div>
                    {order.meeting_title && (
                      <p className="text-xs text-gray-300 truncate">{order.meeting_title}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-200">
                        {format(new Date(order.created_at), 'yyyy.MM.dd (EEE)', { locale: ko })}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {order.total_amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { meetingsApi } from '@/api/meetings';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';
import StatusBadge from '@/components/meeting/StatusBadge';
import MemberList from '@/components/meeting/MemberList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { MeetingDetail } from '@/types';

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: meeting, isLoading } = useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const res = await meetingsApi.getById(Number(id));
      return res.data.data as MeetingDetail;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!meeting) return null;

  const isLeader = meeting.leader_id === user?.id;
  const isMember = meeting.members.some((m) => m.user_id === user?.id);
  const canJoin = meeting.status === 'recruiting' && !isMember && meeting.current_members < meeting.max_members;
  const deliveryPerPerson = Math.ceil(meeting.delivery_fee / meeting.min_members);

  const handleProcessOrder = async () => {
    try {
      await meetingsApi.processOrder(meeting.id);
      toast.success('주문이 진행되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '주문 진행에 실패했습니다.';
      toast.error(msg);
    }
  };

  const handleComplete = async () => {
    try {
      const res = await meetingsApi.complete(meeting.id);
      const refund = res.data.data?.refundPerPerson || 0;
      toast.success(`모임 완료! 인당 ${refund}P 환급`);
      queryClient.invalidateQueries({ queryKey: ['meeting', id] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '모임 완료에 실패했습니다.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header title="모임 상세" />
      <div className="page-container space-y-6">
        {/* 기본 정보 */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={meeting.status} />
            <span className="text-xs text-gray-200">
              {meeting.dining_type === 'together' ? '함께식사' : '각자식사'}
            </span>
          </div>
          <h2 className="text-xl font-bold">{meeting.title || meeting.store_name}</h2>
          <p className="text-sm text-gray-300 mt-1">{meeting.store_name}</p>

          <div className="mt-4 space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span className="text-gray-300">마감 시간</span>
              <span className="font-medium">{format(new Date(meeting.deadline), 'M/d (EEE) HH:mm', { locale: ko })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">인원</span>
              <span className="font-medium">{meeting.current_members} / {meeting.max_members}명 (최소 {meeting.min_members}명)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">인당 예상 배달비</span>
              <span className="font-medium text-primary">{deliveryPerPerson.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">수령 장소</span>
              <span className="font-medium">{meeting.pickup_location}</span>
            </div>
            {meeting.meeting_location && (
              <div className="flex justify-between">
                <span className="text-gray-300">모임 장소</span>
                <span className="font-medium">{meeting.meeting_location}</span>
              </div>
            )}
          </div>
          {meeting.description && (
            <p className="mt-3 text-sm text-gray-300 bg-gray-50 p-3 rounded-xl">{meeting.description}</p>
          )}
        </section>

        {/* 참여 멤버 */}
        <section>
          <h3 className="text-base font-bold mb-3">참여 멤버 ({meeting.members.length})</h3>
          <MemberList members={meeting.members} />
        </section>

        {/* 주문 항목 */}
        {meeting.orderItems.length > 0 && (
          <section>
            <h3 className="text-base font-bold mb-3">주문 내역</h3>
            <div className="space-y-2">
              {meeting.orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.menu_name} x{item.quantity}</p>
                    <p className="text-xs text-gray-300">{item.orderer_nickname}</p>
                  </div>
                  <p className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 액션 버튼 */}
        <div className="space-y-2">
          {canJoin && (
            <button onClick={() => navigate(`/meetings/${meeting.id}/join`)} className="btn-primary">
              참여하기
            </button>
          )}
          {isMember && meeting.status !== 'cancelled' && (
            <button onClick={() => navigate(`/meetings/${meeting.id}/chat`)} className="btn-secondary">
              채팅방 입장
            </button>
          )}
          {isLeader && meeting.status === 'recruiting' && (
            <button onClick={handleProcessOrder} className="btn-primary">
              주문 진행하기
            </button>
          )}
          {isLeader && meeting.status === 'delivered' && (
            <button onClick={handleComplete} className="btn-primary">
              모임 완료 (차액 환급)
            </button>
          )}
          {isMember && meeting.status === 'completed' && (
            <button onClick={() => navigate(`/meetings/${meeting.id}/evaluate`)} className="btn-secondary">
              모임원 평가하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

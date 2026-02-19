import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { meetingsApi } from '@/api/meetings';
import { storesApi } from '@/api/stores';
import { useCartStore } from '@/stores/cartStore';
import Header from '@/components/common/Header';
import MenuItem from '@/components/store/MenuItem';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { MeetingDetail, StoreDetail } from '@/types';

export default function JoinMeetingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pointsUsed, setPointsUsed] = useState(0);
  const { items, addItem, removeItem, updateQuantity, clear, totalPrice } = useCartStore();

  const { data: meeting } = useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const res = await meetingsApi.getById(Number(id));
      return res.data.data as MeetingDetail;
    },
    enabled: !!id,
  });

  const { data: store, isLoading } = useQuery({
    queryKey: ['store', meeting?.store_id],
    queryFn: async () => {
      const res = await storesApi.getById(meeting!.store_id);
      return res.data.data as StoreDetail;
    },
    enabled: !!meeting?.store_id,
  });

  if (isLoading || !meeting || !store) return <LoadingSpinner />;

  const deliveryFeeShare = Math.ceil(meeting.delivery_fee / meeting.min_members);
  const total = totalPrice() + deliveryFeeShare - pointsUsed;

  const handleJoin = async () => {
    if (items.length === 0) {
      toast.error('메뉴를 선택해주세요.');
      return;
    }
    setLoading(true);
    try {
      await meetingsApi.join(meeting.id, {
        menuItems: items.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          isShared: item.isShared,
        })),
        pointsUsed,
      });
      clear();
      toast.success('모임에 참여했습니다!');
      navigate(`/meetings/${meeting.id}`, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '참여에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getQuantity = (menuId: number) => items.find((i) => i.menuId === menuId)?.quantity || 0;

  return (
    <div className="min-h-screen pb-48">
      <Header title="메뉴 선택" />
      <div className="page-container">
        <h2 className="text-lg font-bold mb-1">{store.name}</h2>
        <p className="text-sm text-gray-300 mb-4">{meeting.title}</p>

        <div className="divide-y divide-gray-100">
          {store.menus?.filter((m) => m.is_available).map((menu) => (
            <MenuItem
              key={menu.id}
              menu={menu}
              quantity={getQuantity(menu.id)}
              showControls
              onAdd={() =>
                addItem({
                  menuId: menu.id,
                  menuName: menu.name,
                  price: menu.price,
                  quantity: 1,
                  isShared: false,
                })
              }
              onRemove={() => {
                const q = getQuantity(menu.id);
                if (q <= 1) removeItem(menu.id);
                else updateQuantity(menu.id, q - 1);
              }}
            />
          ))}
        </div>
      </div>

      {/* 하단 결제 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 p-4 space-y-3 z-40">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">포인트 사용</span>
          <input
            type="number"
            min={0}
            value={pointsUsed}
            onChange={(e) => setPointsUsed(Math.max(0, Number(e.target.value)))}
            className="w-24 text-right input-field py-1 px-2"
          />
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">메뉴 금액</span>
            <span>{totalPrice().toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">배달비 (인당)</span>
            <span>{deliveryFeeShare.toLocaleString()}원</span>
          </div>
          {pointsUsed > 0 && (
            <div className="flex justify-between text-primary">
              <span>포인트 할인</span>
              <span>-{pointsUsed.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
            <span>총 결제 금액</span>
            <span className="text-primary">{Math.max(0, total).toLocaleString()}원</span>
          </div>
        </div>
        <button onClick={handleJoin} disabled={loading || items.length === 0} className="btn-primary">
          {loading ? '참여 중...' : `${Math.max(0, total).toLocaleString()}원 결제하고 참여`}
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { storesApi } from '@/api/stores';
import { meetingsApi } from '@/api/meetings';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { StoreDetail } from '@/types';

interface MeetingForm {
  title: string;
  diningType: 'individual' | 'together';
  orderType: 'instant' | 'reservation';
  pickupLocation: string;
  meetingLocation: string;
  minMembers: number;
  maxMembers: number;
  deliveryFee: number;
  allowEarlyOrder: boolean;
  deadline: string;
  description: string;
}

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = Number(searchParams.get('storeId'));
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const { data: store, isLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: async () => {
      const res = await storesApi.getById(storeId);
      return res.data.data as StoreDetail;
    },
    enabled: !!storeId,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<MeetingForm>({
    defaultValues: {
      diningType: 'individual',
      orderType: 'instant',
      minMembers: 2,
      maxMembers: 4,
      allowEarlyOrder: false,
      deliveryFee: 0,
    },
  });

  const onSubmit = async (data: MeetingForm) => {
    setLoading(true);
    try {
      const res = await meetingsApi.create({
        storeId,
        title: data.title,
        diningType: data.diningType,
        orderType: data.orderType,
        pickupLocation: data.pickupLocation,
        meetingLocation: data.meetingLocation || undefined,
        minMembers: Number(data.minMembers),
        maxMembers: Number(data.maxMembers),
        deliveryFee: Number(data.deliveryFee || store?.delivery_fee || 0),
        allowEarlyOrder: data.allowEarlyOrder,
        deadline: new Date(data.deadline).toISOString(),
        description: data.description || undefined,
        campus: user?.campus || undefined,
      });
      if (res.data.success && res.data.data) {
        toast.success('모임이 생성되었습니다!');
        navigate(`/meetings/${res.data.data.id}`, { replace: true });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '모임 생성에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!store) return <div className="page-container">가게를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen">
      <Header title="모임 만들기" />
      <div className="page-container">
        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl mb-6">
          {store.thumbnail ? (
            <img src={store.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">🏪</div>
          )}
          <div>
            <p className="font-semibold text-sm">{store.name}</p>
            <p className="text-xs text-gray-300">배달비 {store.delivery_fee.toLocaleString()}원 | 최소주문 {store.min_order_amount.toLocaleString()}원</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">모임 제목</label>
            <input className="input-field" placeholder="예: 같이 치킨 시켜요!" {...register('title', { required: '제목을 입력해주세요.' })} />
            {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">식사 방식</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
                <input type="radio" value="individual" {...register('diningType')} className="accent-primary" />
                <span className="text-sm">각자 식사</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
                <input type="radio" value="together" {...register('diningType')} className="accent-primary" />
                <span className="text-sm">함께 식사</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block">주문 방식</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
                <input type="radio" value="instant" {...register('orderType')} className="accent-primary" />
                <span className="text-sm">바로 주문</span>
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-100 rounded-xl cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-50">
                <input type="radio" value="reservation" {...register('orderType')} className="accent-primary" />
                <span className="text-sm">예약 주문</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">수령 장소</label>
            <input className="input-field" placeholder="배달 받을 장소" {...register('pickupLocation', { required: '수령 장소를 입력해주세요.' })} />
            {errors.pickupLocation && <p className="text-error text-xs mt-1">{errors.pickupLocation.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">모임 장소 (선택)</label>
            <input className="input-field" placeholder="함께 식사할 장소" {...register('meetingLocation')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">최소 인원</label>
              <input type="number" className="input-field" min={2} {...register('minMembers', { required: true, min: 2 })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">최대 인원</label>
              <input type="number" className="input-field" min={2} {...register('maxMembers', { required: true, min: 2 })} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">배달비</label>
            <input type="number" className="input-field" placeholder={String(store.delivery_fee)} {...register('deliveryFee')} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">주문 마감 시간</label>
            <input type="datetime-local" className="input-field" {...register('deadline', { required: '마감 시간을 설정해주세요.' })} />
            {errors.deadline && <p className="text-error text-xs mt-1">{errors.deadline.message}</p>}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('allowEarlyOrder')} className="accent-primary w-4 h-4" />
            <span className="text-sm text-gray-400">기한 전 조기 주문 허용</span>
          </label>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">추가 설명 (선택)</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="모임에 대한 추가 설명"
              {...register('description')}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '생성 중...' : '모임 만들기'}
          </button>
        </form>
      </div>
    </div>
  );
}

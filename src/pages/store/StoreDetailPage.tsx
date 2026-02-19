import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/api/stores';
import Header from '@/components/common/Header';
import MenuItem from '@/components/store/MenuItem';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { StoreDetail } from '@/types';

const categoryLabel: Record<string, string> = {
  korean: '한식', chinese: '중식', japanese: '일식', western: '양식',
  chicken: '치킨', pizza: '피자', burger: '버거', snack: '분식', dessert: '디저트', etc: '기타',
};

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: store, isLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      const res = await storesApi.getById(Number(id));
      return res.data.data as StoreDetail;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!store) return null;

  return (
    <div className="min-h-screen">
      <Header title={store.name} />

      {store.thumbnail ? (
        <img src={store.thumbnail} alt="" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-primary-50 flex items-center justify-center">
          <span className="text-5xl">🏪</span>
        </div>
      )}

      <div className="page-container">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-primary font-medium bg-primary-50 px-2 py-0.5 rounded">
              {categoryLabel[store.category] || '기타'}
            </span>
          </div>
          <h2 className="text-xl font-bold">{store.name}</h2>
          {store.description && (
            <p className="text-sm text-gray-300 mt-1">{store.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-300">
            {store.phone && <span>전화 {store.phone}</span>}
            {store.open_time && <span>영업 {store.open_time}~{store.close_time}</span>}
            <span>배달비 {store.delivery_fee.toLocaleString()}원</span>
            <span>최소주문 {store.min_order_amount.toLocaleString()}원</span>
          </div>
        </div>

        <h3 className="text-base font-bold mb-3">메뉴</h3>
        <div className="divide-y divide-gray-100">
          {store.menus?.filter((m) => m.is_available).map((menu) => (
            <MenuItem key={menu.id} menu={menu} />
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate(`/meetings/create?storeId=${store.id}`)}
            className="btn-primary"
          >
            이 가게로 모임 만들기
          </button>
        </div>
      </div>
    </div>
  );
}

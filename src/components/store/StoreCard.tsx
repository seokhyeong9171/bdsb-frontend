import { useNavigate } from 'react-router-dom';
import type { Store } from '@/types';

const categoryLabel: Record<string, string> = {
  korean: '한식', chinese: '중식', japanese: '일식', western: '양식',
  chicken: '치킨', pizza: '피자', burger: '버거', snack: '분식', dessert: '디저트', etc: '기타',
};

export default function StoreCard({ store }: { store: Store }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/stores/${store.id}`)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 overflow-hidden active:bg-gray-50 transition-colors"
    >
      {store.thumbnail ? (
        <img src={store.thumbnail} alt="" className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-primary-50 flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-primary font-medium bg-primary-50 px-2 py-0.5 rounded">
            {categoryLabel[store.category] || '기타'}
          </span>
        </div>
        <h3 className="font-semibold text-sm">{store.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
          <span>배달비 {store.delivery_fee.toLocaleString()}원</span>
          <span>·</span>
          <span>최소주문 {store.min_order_amount.toLocaleString()}원</span>
        </div>
      </div>
    </button>
  );
}

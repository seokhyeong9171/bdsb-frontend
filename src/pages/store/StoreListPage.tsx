import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/api/stores';
import Header from '@/components/common/Header';
import StoreCard from '@/components/store/StoreCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { Store, StoreCategory } from '@/types';

const categories: { value: StoreCategory | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'korean', label: '한식' },
  { value: 'chinese', label: '중식' },
  { value: 'japanese', label: '일식' },
  { value: 'western', label: '양식' },
  { value: 'chicken', label: '치킨' },
  { value: 'pizza', label: '피자' },
  { value: 'burger', label: '버거' },
  { value: 'snack', label: '분식' },
  { value: 'dessert', label: '디저트' },
];

export default function StoreListPage() {
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['stores', category],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      const res = await storesApi.list(params);
      return res.data.data as Store[];
    },
  });

  return (
    <div className="min-h-screen">
      <Header title="가게 목록" showBack={false} />
      <div className="page-container">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === c.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-50 text-gray-300 border border-gray-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {isLoading ? (
            <div className="col-span-2"><LoadingSpinner /></div>
          ) : !data || data.length === 0 ? (
            <div className="col-span-2"><EmptyState message="등록된 가게가 없어요" /></div>
          ) : (
            data.map((store) => <StoreCard key={store.id} store={store} />)
          )}
        </div>
      </div>
    </div>
  );
}

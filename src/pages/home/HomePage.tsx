import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { meetingsApi } from '@/api/meetings';
import MeetingCard from '@/components/meeting/MeetingCard';
import MeetingFilter from '@/components/meeting/MeetingFilter';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { Meeting } from '@/types';

const statusTabs = [
  { value: '', label: '모집중' },
  { value: 'all', label: '전체' },
  { value: 'ordered', label: '주문됨' },
  { value: 'completed', label: '완료' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['meetings', category, sort, statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = { sort };
      if (category) params.category = category;
      if (statusFilter) params.status = statusFilter;
      const res = await meetingsApi.list(params);
      const raw = res.data.data;
      if (Array.isArray(raw)) return raw as Meeting[];
      return [];
    },
    retry: 0,
  });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="w-8 h-8" />
          <h1 className="text-lg font-bold text-primary">밥드실분</h1>
        </div>
        <button onClick={() => navigate('/notifications')} className="p-1">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="#363841" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <div className="page-container">
        {/* 상태 탭 */}
        <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <MeetingFilter
          category={category}
          sort={sort}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />

        <div className="mt-4 space-y-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <EmptyState message="모임을 불러올 수 없어요" sub="서버 연결을 확인해주세요." />
          ) : !data || data.length === 0 ? (
            <EmptyState
              message={statusFilter === '' ? '모집 중인 모임이 없어요' : '모임이 없어요'}
              sub="새로운 모임을 만들어보세요!"
            />
          ) : (
            data.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/stores')}
        className="fixed bottom-20 right-4 max-w-[480px] w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-30"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

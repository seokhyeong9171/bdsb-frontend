import type { MeetingStatus } from '@/types';

const statusConfig: Record<MeetingStatus, { label: string; bg: string; text: string }> = {
  recruiting: { label: '모집중', bg: 'bg-primary-50', text: 'text-primary' },
  closed: { label: '모집마감', bg: 'bg-gray-100', text: 'text-gray-400' },
  ordered: { label: '주문완료', bg: 'bg-blue-50', text: 'text-blue-600' },
  cooking: { label: '조리중', bg: 'bg-orange-50', text: 'text-orange-600' },
  delivering: { label: '배달중', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  delivered: { label: '배달완료', bg: 'bg-green-50', text: 'text-green-600' },
  completed: { label: '완료', bg: 'bg-gray-100', text: 'text-gray-400' },
  cancelled: { label: '취소', bg: 'bg-red-50', text: 'text-red-500' },
};

export default function StatusBadge({ status }: { status: MeetingStatus }) {
  const c = statusConfig[status];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

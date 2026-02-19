import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Meeting } from '@/types';
import StatusBadge from './StatusBadge';

const categoryLabel: Record<string, string> = {
  korean: '한식', chinese: '중식', japanese: '일식', western: '양식',
  chicken: '치킨', pizza: '피자', burger: '버거', snack: '분식', dessert: '디저트', etc: '기타',
};

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const navigate = useNavigate();

  const deadlineStr = format(new Date(meeting.deadline), 'M/d (EEE) HH:mm', { locale: ko });
  const deliveryPerPerson = Math.ceil(meeting.delivery_fee / meeting.min_members);

  return (
    <button
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        {meeting.store_thumbnail ? (
          <img src={meeting.store_thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={meeting.status} />
            <span className="text-xs text-gray-200">
              {categoryLabel[meeting.store_category] || '기타'}
            </span>
            <span className="text-xs text-gray-200">
              {meeting.dining_type === 'together' ? '함께식사' : '각자식사'}
            </span>
          </div>
          <h3 className="font-semibold text-sm truncate">
            {meeting.title || meeting.store_name}
          </h3>
          <p className="text-xs text-gray-300 mt-0.5">{meeting.store_name}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-300">
            <span>👥 {meeting.current_members}/{meeting.max_members}</span>
            <span>⏰ {deadlineStr}까지</span>
            <span>🚗 {deliveryPerPerson.toLocaleString()}원/인</span>
          </div>
        </div>
      </div>
    </button>
  );
}

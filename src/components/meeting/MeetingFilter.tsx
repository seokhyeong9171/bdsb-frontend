import type { StoreCategory } from '@/types';

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

interface MeetingFilterProps {
  category: string;
  sort: string;
  onCategoryChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

export default function MeetingFilter({ category, sort, onCategoryChange, onSortChange }: MeetingFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
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
      <div className="flex gap-2">
        <button
          onClick={() => onSortChange('latest')}
          className={`text-xs font-medium ${sort === 'latest' ? 'text-primary' : 'text-gray-200'}`}
        >
          최신순
        </button>
        <span className="text-gray-100">|</span>
        <button
          onClick={() => onSortChange('deadline')}
          className={`text-xs font-medium ${sort === 'deadline' ? 'text-primary' : 'text-gray-200'}`}
        >
          마감임박순
        </button>
      </div>
    </div>
  );
}

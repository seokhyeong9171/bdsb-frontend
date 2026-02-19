import type { BadgeType } from '@/types';

const config: Record<BadgeType, { label: string; emoji: string; bg: string; text: string }> = {
  good: { label: '만족', emoji: '😊', bg: 'bg-green-50', text: 'text-green-600' },
  normal: { label: '보통', emoji: '😐', bg: 'bg-yellow-50', text: 'text-yellow-600' },
  bad: { label: '불만족', emoji: '😞', bg: 'bg-red-50', text: 'text-red-500' },
};

interface BadgeProps {
  type: BadgeType;
  count?: number;
}

export default function Badge({ type, count }: BadgeProps) {
  const c = config[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.emoji} {c.label}{count !== undefined && ` ${count}`}
    </span>
  );
}

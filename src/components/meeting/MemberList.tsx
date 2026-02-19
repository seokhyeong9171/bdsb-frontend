import { useNavigate } from 'react-router-dom';
import type { MeetingMember } from '@/types';

export default function MemberList({ members }: { members: MeetingMember[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => navigate(`/users/${m.user_id}`)}
          className="flex items-center gap-3 w-full p-2 rounded-xl active:bg-gray-50 transition-colors"
        >
          {m.profile_image ? (
            <img src={m.profile_image} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-sm">
              😊
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">
              {m.nickname}
              {m.is_leader && (
                <span className="ml-1 text-xs text-primary font-semibold">모임장</span>
              )}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

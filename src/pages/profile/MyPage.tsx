import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { UserProfile } from '@/types';

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await usersApi.getProfile();
      return res.data.data as UserProfile;
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <div className="min-h-screen">
      <Header title="마이페이지" showBack={false} />
      <div className="page-container space-y-6">
        {/* 프로필 카드 */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-2xl">
                😊
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{profile.nickname}</h2>
              <p className="text-sm text-gray-300">{profile.department || profile.email}</p>
            </div>
            <button
              onClick={() => navigate('/mypage/edit')}
              className="px-3 py-1.5 text-xs font-medium text-primary bg-primary-50 rounded-lg"
            >
              수정
            </button>
          </div>

          {/* 뱃지 */}
          {profile.badges.length > 0 && (
            <div className="flex gap-2 mt-4">
              {profile.badges.map((b) => (
                <Badge key={b.badge} type={b.badge} count={b.count} />
              ))}
            </div>
          )}
        </section>

        {/* 요약 정보 */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-primary-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{profile.points.toLocaleString()}</p>
            <p className="text-xs text-gray-300 mt-1">보유 포인트</p>
          </div>
          <div className="bg-primary-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{profile.completed_meetings}</p>
            <p className="text-xs text-gray-300 mt-1">완료 모임</p>
          </div>
        </section>

        {/* 메뉴 리스트 */}
        <section className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
          <MenuItem label="주문 내역" onClick={() => navigate('/orders')} />
          <MenuItem label="알림" onClick={() => navigate('/notifications')} />
          <MenuItem label="문의하기" onClick={() => navigate('/inquiries')} />
          <MenuItem label="회원 탈퇴" onClick={() => navigate('/mypage/delete')} danger />
        </section>

        <button onClick={handleLogout} className="btn-outline">
          로그아웃
        </button>
      </div>
    </div>
  );
}

function MenuItem({ label, onClick, danger = false }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full px-5 py-4 active:bg-gray-50">
      <span className={`text-sm font-medium ${danger ? 'text-error' : 'text-gray-500'}`}>{label}</span>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6" stroke={danger ? '#FE4E39' : '#B4BAC6'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

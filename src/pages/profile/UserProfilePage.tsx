import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import Header from '@/components/common/Header';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { PublicUser } from '@/types';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await usersApi.getUserInfo(Number(id));
      return res.data.data as PublicUser;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Header title="프로필" />
      <div className="page-container">
        <div className="flex flex-col items-center text-center">
          {user.profile_image ? (
            <img src={user.profile_image} alt="" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-4xl">
              😊
            </div>
          )}
          <h2 className="text-xl font-bold mt-4">{user.nickname}</h2>
          {user.department && (
            <p className="text-sm text-gray-300 mt-1">{user.department}</p>
          )}
          <p className="text-sm text-gray-300 mt-1">완료 모임 {user.completed_meetings}회</p>

          {user.badges.length > 0 && (
            <div className="flex gap-2 mt-4">
              {user.badges.map((b) => (
                <Badge key={b.badge} type={b.badge} count={b.count} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { UserProfile } from '@/types';

interface EditForm {
  currentPassword: string;
  nickname: string;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  const [loading, setLoading] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await usersApi.getProfile();
      return res.data.data as UserProfile;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<EditForm>({
    values: profile ? { currentPassword: '', nickname: profile.nickname } : undefined,
  });

  const onSubmit = async (data: EditForm) => {
    setLoading(true);
    try {
      await usersApi.updateProfile({
        currentPassword: data.currentPassword,
        nickname: data.nickname,
      });
      updateUser({ nickname: data.nickname });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('프로필이 수정되었습니다.');
      navigate(-1);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '수정에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <div className="min-h-screen">
      <Header title="프로필 수정" />
      <div className="page-container">
        <div className="flex flex-col items-center mb-8">
          {profile.profile_image ? (
            <img src={profile.profile_image} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center text-3xl">
              😊
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">현재 비밀번호 (필수)</label>
            <input
              type="password"
              className="input-field"
              placeholder="비밀번호를 입력해주세요"
              {...register('currentPassword', { required: '비밀번호를 입력해주세요.' })}
            />
            {errors.currentPassword && <p className="text-error text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">닉네임</label>
            <input
              type="text"
              className="input-field"
              {...register('nickname', { required: '닉네임을 입력해주세요.' })}
            />
            {errors.nickname && <p className="text-error text-xs mt-1">{errors.nickname.message}</p>}
          </div>

          <div className="pt-2 space-y-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

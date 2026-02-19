import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ password: string }>();

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    try {
      await usersApi.deleteAccount(data.password);
      logout();
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '탈퇴에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="회원 탈퇴" />
      <div className="page-container">
        <div className="bg-red-50 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-error mb-2">탈퇴 시 주의사항</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>- 진행 중인 모임이 있으면 탈퇴할 수 없습니다.</li>
            <li>- 잔여 포인트가 있으면 탈퇴할 수 없습니다.</li>
            <li>- 탈퇴 후에는 복구할 수 없습니다.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">비밀번호 확인</label>
            <input
              type="password"
              className="input-field"
              placeholder="비밀번호를 입력해주세요"
              {...register('password', { required: '비밀번호를 입력해주세요.' })}
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-error text-white font-semibold rounded-xl active:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? '처리 중...' : '회원 탈퇴'}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.data.success && res.data.data) {
        login(res.data.data.accessToken, res.data.data.user);
        toast.success('로그인 성공!');
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '로그인에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6">
      <div className="mb-10 text-center">
        <img src="/logo.svg" alt="밥드실분" className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">밥드실분</h1>
        <p className="text-sm text-gray-300 mt-1">같이 시켜먹자!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="이메일"
            className="input-field"
            {...register('email', { required: '이메일을 입력해주세요.' })}
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="비밀번호"
            className="input-field"
            {...register('password', { required: '비밀번호를 입력해주세요.' })}
          />
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-300 mt-6">
        계정이 없으신가요?{' '}
        <Link to="/register" className="text-primary font-semibold">회원가입</Link>
      </p>
    </div>
  );
}

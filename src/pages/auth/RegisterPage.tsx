import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/common/Header';
import type { RegisterRequest } from '@/types';

interface RegisterForm extends RegisterRequest {
  passwordConfirm: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { passwordConfirm: _, ...payload } = data;
      const res = await authApi.register(payload);
      if (res.data.success && res.data.data) {
        login(res.data.data.accessToken, res.data.data.user);
        toast.success('회원가입 성공!');
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '회원가입에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="회원가입" />
      <form onSubmit={handleSubmit(onSubmit)} className="page-container space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">이메일 (학교 이메일)</label>
          <input
            type="email"
            placeholder="example@university.ac.kr"
            className="input-field"
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '유효한 이메일을 입력해주세요.' },
            })}
          />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">비밀번호</label>
          <input
            type="password"
            placeholder="8자 이상"
            className="input-field"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: { value: 8, message: '8자 이상 입력해주세요.' },
            })}
          />
          {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            className="input-field"
            {...register('passwordConfirm', {
              required: '비밀번호를 다시 입력해주세요.',
              validate: (val) => val === watch('password') || '비밀번호가 일치하지 않습니다.',
            })}
          />
          {errors.passwordConfirm && <p className="text-error text-xs mt-1">{errors.passwordConfirm.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">이름</label>
          <input
            type="text"
            placeholder="실명"
            className="input-field"
            {...register('name', { required: '이름을 입력해주세요.' })}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">휴대폰 번호</label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            className="input-field"
            {...register('phone', { required: '휴대폰 번호를 입력해주세요.' })}
          />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">학과 (선택)</label>
          <input
            type="text"
            placeholder="학과를 입력해주세요"
            className="input-field"
            {...register('department')}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-400 mb-1 block">주소 (선택)</label>
          <input
            type="text"
            placeholder="주소를 입력해주세요"
            className="input-field"
            {...register('address')}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

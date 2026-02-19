import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { inquiriesApi } from '@/api/inquiries';
import Header from '@/components/common/Header';

interface InquiryForm {
  title: string;
  content: string;
}

export default function InquiryCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<InquiryForm>();

  const onSubmit = async (data: InquiryForm) => {
    setLoading(true);
    try {
      await inquiriesApi.create(data);
      toast.success('문의가 등록되었습니다.');
      navigate('/inquiries', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '문의 등록에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="문의 작성" />
      <div className="page-container">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">제목</label>
            <input
              className="input-field"
              placeholder="문의 제목을 입력해주세요"
              {...register('title', { required: '제목을 입력해주세요.' })}
            />
            {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1 block">내용</label>
            <textarea
              className="input-field min-h-[200px] resize-none"
              placeholder="문의 내용을 자세히 적어주세요"
              {...register('content', { required: '내용을 입력해주세요.' })}
            />
            {errors.content && <p className="text-error text-xs mt-1">{errors.content.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '등록 중...' : '문의 등록'}
          </button>
        </form>
      </div>
    </div>
  );
}

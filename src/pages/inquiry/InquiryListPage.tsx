import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { inquiriesApi } from '@/api/inquiries';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { Inquiry } from '@/types';

export default function InquiryListPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const res = await inquiriesApi.getMyList();
      return res.data.data as Inquiry[];
    },
  });

  return (
    <div className="min-h-screen">
      <Header
        title="문의하기"
        right={
          <button
            onClick={() => navigate('/inquiries/new')}
            className="text-sm text-primary font-semibold"
          >
            작성
          </button>
        }
      />
      <div className="page-container">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data || data.length === 0 ? (
          <EmptyState message="문의 내역이 없어요" sub="궁금한 점이 있으면 문의해주세요." />
        ) : (
          <div className="space-y-3">
            {data.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    inquiry.status === 'answered'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {inquiry.status === 'answered' ? '답변완료' : '대기중'}
                  </span>
                  <span className="text-xs text-gray-200">
                    {format(new Date(inquiry.created_at), 'yyyy.MM.dd')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold">{inquiry.title}</h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">{inquiry.content}</p>
                {inquiry.answer && (
                  <div className="mt-3 p-3 bg-primary-50 rounded-xl">
                    <p className="text-xs font-medium text-primary mb-1">답변</p>
                    <p className="text-xs text-gray-400">{inquiry.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

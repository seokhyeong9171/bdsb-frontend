import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { evaluationsApi } from '@/api/evaluations';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import type { EvaluationTarget, BadgeType } from '@/types';

const badgeOptions: { value: BadgeType; label: string; emoji: string; bg: string; border: string }[] = [
  { value: 'good', label: '만족', emoji: '😊', bg: 'bg-green-50', border: 'border-green-300' },
  { value: 'normal', label: '보통', emoji: '😐', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  { value: 'bad', label: '불만족', emoji: '😞', bg: 'bg-red-50', border: 'border-red-300' },
];

export default function EvaluationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<number, BadgeType>>({});
  const [loading, setLoading] = useState(false);

  const { data: targets, isLoading } = useQuery({
    queryKey: ['evaluationTargets', id],
    queryFn: async () => {
      const res = await evaluationsApi.getTargets(Number(id));
      return res.data.data as EvaluationTarget[];
    },
    enabled: !!id,
  });

  const handleSubmit = async () => {
    const evaluations = Object.entries(selections).map(([targetId, badge]) => ({
      targetId: Number(targetId),
      badge,
    }));

    if (evaluations.length === 0) {
      toast.error('평가할 멤버를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      await evaluationsApi.submit(Number(id), evaluations);
      toast.success('평가가 완료되었습니다!');
      navigate(`/meetings/${id}`, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || '평가에 실패했습니다.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const evaluatable = targets?.filter((t) => !t.already_evaluated) || [];

  return (
    <div className="min-h-screen">
      <Header title="모임원 평가" />
      <div className="page-container">
        {evaluatable.length === 0 ? (
          <EmptyState message="평가할 멤버가 없어요" sub="이미 모든 멤버를 평가했습니다." />
        ) : (
          <>
            <p className="text-sm text-gray-300 mb-6">
              함께한 모임원에 대해 평가해주세요.
            </p>
            <div className="space-y-5">
              {evaluatable.map((target) => (
                <div key={target.user_id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {target.profile_image ? (
                      <img src={target.profile_image} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-sm">
                        😊
                      </div>
                    )}
                    <p className="font-medium text-sm">{target.nickname}</p>
                  </div>
                  <div className="flex gap-2">
                    {badgeOptions.map((opt) => {
                      const selected = selections[target.user_id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setSelections((prev) => ({ ...prev, [target.user_id]: opt.value }))
                          }
                          className={`flex-1 py-2.5 rounded-xl text-center text-sm font-medium border-2 transition-colors ${
                            selected
                              ? `${opt.bg} ${opt.border}`
                              : 'bg-gray-50 border-transparent text-gray-300'
                          }`}
                        >
                          {opt.emoji} {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || Object.keys(selections).length === 0}
              className="btn-primary mt-6"
            >
              {loading ? '제출 중...' : '평가 완료'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

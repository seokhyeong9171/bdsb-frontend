interface EmptyStateProps {
  message: string;
  sub?: string;
}

export default function EmptyState({ message, sub }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-primary-50 flex items-center justify-center">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            stroke="#6F6CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-gray-400 font-medium">{message}</p>
      {sub && <p className="text-gray-200 text-sm mt-1">{sub}</p>}
    </div>
  );
}

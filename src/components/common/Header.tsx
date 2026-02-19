import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export default function Header({ title, showBack = true, right }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="#010B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}

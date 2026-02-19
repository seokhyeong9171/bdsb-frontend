import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-100">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="메시지를 입력하세요"
        className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

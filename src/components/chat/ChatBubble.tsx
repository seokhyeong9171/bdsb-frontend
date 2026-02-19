import { format } from 'date-fns';
import type { ChatMessage } from '@/types';

interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function ChatBubble({ message, isMine }: ChatBubbleProps) {
  const time = format(new Date(message.created_at), 'HH:mm');

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isMine && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs">
            😊
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-0.5">{message.nickname}</p>
        </div>
      )}
      <div className={`flex items-end gap-1 max-w-[70%] ${isMine ? 'flex-row-reverse' : ''}`}>
        <div
          className={`px-3 py-2 rounded-2xl text-sm break-words ${
            isMine
              ? 'bg-primary text-white rounded-tr-sm'
              : 'bg-gray-50 text-gray-900 rounded-tl-sm'
          }`}
        >
          {message.message}
        </div>
        <span className="text-[10px] text-gray-200 flex-shrink-0">{time}</span>
      </div>
    </div>
  );
}

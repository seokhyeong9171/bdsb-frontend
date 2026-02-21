import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '@/api/chat';
import { useAuthStore } from '@/stores/authStore';
import { connectSocket, getSocket, disconnectSocket } from '@/lib/socket';
import Header from '@/components/common/Header';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { ChatMessage } from '@/types';

export default function ChatRoomPage() {
  const { id: meetingId } = useParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [socketError, setSocketError] = useState(false);

  // 채팅방 가져오기
  const { isLoading } = useQuery({
    queryKey: ['chatRoom', meetingId],
    queryFn: async () => {
      const res = await chatApi.getRoom(Number(meetingId));
      const room = res.data.data;
      if (room) setRoomId(room.id);
      return room;
    },
    enabled: !!meetingId,
  });

  // 메시지 불러오기
  useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: async () => {
      const res = await chatApi.getMessages(roomId!, { limit: 100 });
      const msgs = res.data.data || [];
      setMessages(msgs);
      return msgs;
    },
    enabled: !!roomId,
  });

  // Socket 연결
  useEffect(() => {
    if (!token || !roomId) return;

    setSocketError(false);
    const socket = connectSocket(token);

    socket.on('connect', () => {
      setSocketError(false);
      socket.emit('join_room', roomId);
    });

    // 이미 연결된 상태면 바로 방 참여
    if (socket.connected) {
      socket.emit('join_room', roomId);
    }

    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('connect_error', () => {
      setSocketError(true);
    });

    return () => {
      socket.off('connect');
      socket.off('new_message');
      socket.off('connect_error');
      socket.emit('leave_room', roomId);
      disconnectSocket();
    };
  }, [token, roomId]);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    const socket = getSocket();
    if (socket && roomId) {
      socket.emit('send_message', { roomId, message });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-screen">
      <Header title="채팅" />
      {socketError && (
        <div className="bg-red-50 text-red-600 text-sm text-center py-2 px-4">
          채팅 서버 연결에 실패했습니다. 재연결 시도 중...
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isMine={msg.sender_id === user?.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

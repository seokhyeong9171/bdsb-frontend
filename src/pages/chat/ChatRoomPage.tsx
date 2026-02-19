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

    const socket = connectSocket(token);
    socket.emit('join_room', roomId);

    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit('leave_room', roomId);
      socket.off('new_message');
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

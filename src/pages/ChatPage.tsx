import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChatRoomList } from '../components/chat/ChatRoomList'
import { ChatRoom } from '../components/chat/ChatRoom'
import { chatApi } from '../api/chatApi'
import { useChat } from '../hooks/useChat'

export function ChatPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const roomIdNumber = roomId ? Number(roomId) : null

  const { data: rooms, isLoading: isRoomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: chatApi.getRooms,
    enabled: !roomId, // roomId 없을 때만 실행
  })

  // 소켓 연결 (useChat 훅 사용)
  const { messages, isConnected, sendMessage, setInitialMessages } =
    useChat(roomIdNumber)

  const { data: initialMessages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: () => chatApi.getMessages(roomIdNumber!),
    enabled: !!roomId, // roomId 있을 때만 실행
  })

  useEffect(() => {
    if (initialMessages) {
      setInitialMessages(initialMessages)
    }
  }, [initialMessages, setInitialMessages])

  const handleSelectRoom = (selectedRoomId: number) => {
    navigate(`/chat/${selectedRoomId}`)
  }

  if (roomId) {
    return (
      <div className="h-[calc(100vh-120px)]">
        <ChatRoom
          messages={messages}
          isLoading={isMessagesLoading}
          onSend={sendMessage}
          disabled={!isConnected}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-surface-900">채팅</h1>
      <ChatRoomList
        rooms={rooms}
        isLoading={isRoomsLoading}
        onSelect={handleSelectRoom}
      />
    </div>
  )
}

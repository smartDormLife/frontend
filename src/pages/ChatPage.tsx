import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChatRoomList } from '../components/chat/ChatRoomList'
import { ChatRoom } from '../components/chat/ChatRoom'
import { chatApi } from '../api/chatApi'
import { useChat } from '../hooks/useChat'
import { useChatNotifications } from '../hooks/useChatNotifications'

export function ChatPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const roomIdNumber = roomId ? Number(roomId) : null

  // 채팅 목록에서만 실시간 알림 활성화
  const isListView = !roomId
  useChatNotifications(isListView)

  const { data: rooms, isLoading: isRoomsLoading, refetch: refetchRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: chatApi.getRooms,
    enabled: isListView, // roomId 없을 때만 실행
    staleTime: 0, // 항상 최신 데이터 가져오기
    refetchOnMount: 'always', // 마운트될 때마다 refetch
  })

  // 채팅 목록 페이지로 돌아올 때마다 갱신
  useEffect(() => {
    if (isListView) {
      refetchRooms()
    }
  }, [isListView, refetchRooms])

  // 소켓 연결 (useChat 훅 사용)
  const { messages, isConnected, sendMessage, setInitialMessages } =
    useChat(roomIdNumber)

  const { data: initialMessages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['chatMessages', roomId],
    queryFn: () => chatApi.getMessages(roomIdNumber!),
    enabled: !!roomId, // roomId 있을 때만 실행
    staleTime: 0, // 항상 최신 데이터 가져오기
    refetchOnMount: 'always', // 마운트될 때마다 refetch
  })

  useEffect(() => {
    if (initialMessages) {
      console.log('초기 메시지 로드:', initialMessages.length, '개')
      setInitialMessages(initialMessages)
    }
  }, [initialMessages, setInitialMessages])

  // 채팅방 입장 시 읽음 처리
  const queryClient = useQueryClient()
  useEffect(() => {
    // 메시지가 로드된 후에 읽음 처리 (그래야 안읽음 선이 보임)
    if (roomIdNumber && initialMessages) {
      chatApi.markAsRead(roomIdNumber).then(() => {
        console.log('✅ 채팅방 읽음 처리 완료:', roomIdNumber)
        // 읽음 처리 후 채팅방 목록(안읽은 개수 포함) 갱신
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
      })
    }
  }, [roomIdNumber, queryClient, initialMessages])

  const handleSelectRoom = (selectedRoomId: number) => {
    navigate(`/chat/${selectedRoomId}`)
  }

  if (roomId) {
    return (
      <div className="h-[calc(100vh-120px)]">
        <ChatRoom
          key={roomId} // roomId가 변경되면 ChatRoom 컴포넌트를 완전히 재생성
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

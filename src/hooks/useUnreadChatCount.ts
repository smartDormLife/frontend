import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../api/chatApi'

/**
 * 읽지 않은 채팅 메시지가 있는지 확인하는 훅
 * 실시간으로 새 메시지 알림을 표시하기 위해 사용
 */
export function useUnreadChatCount() {
  const { data: rooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: chatApi.getRooms,
    staleTime: 0,
    refetchInterval: 5000, // 5초마다 갱신하여 실시간성 향상
  })

  const totalUnreadCount = rooms?.reduce((sum, room) => sum + (room.unread_count || 0), 0) || 0

  return {
    totalUnreadCount,
    hasUnread: totalUnreadCount > 0,
  }
}

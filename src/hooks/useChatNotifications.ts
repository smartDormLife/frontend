import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import type { ChatMessage, ChatRoom, User } from '../types'
import { chatApi } from '../api/chatApi'

/**
 * 채팅 목록 페이지에서 실시간 알림을 받기 위한 훅
 * 모든 채팅방의 새 메시지를 수신하고 캐시를 업데이트합니다
 */
export function useChatNotifications(enabled: boolean = true) {
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)

  // 현재 로그인한 사용자 정보 가져오기
  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (!enabled) {
      // 비활성화된 경우 소켓 연결 끊기
      if (socketRef.current) {
        console.log('🔕 채팅 알림 소켓 연결 해제')
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    // 이미 연결되어 있으면 재사용
    if (socketRef.current?.connected) {
      console.log('🔔 채팅 알림 소켓 이미 연결됨')
      return
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    console.log('🔔 채팅 알림 소켓 연결 중...')
    const socket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ 채팅 알림 소켓 연결 성공')
    })

    socket.on('disconnect', () => {
      console.log('❌ 채팅 알림 소켓 연결 끊김')
    })

    // 새 메시지 수신 시 채팅방 목록 캐시 업데이트
    socket.on('newMessage', async (message: ChatMessage) => {
      console.log('🔔 새 메시지 알림:', message)

      // 현재 사용자가 해당 채팅방에 있는지 확인
      // window.location.pathname을 사용하여 현재 경로 확인
      const currentPath = window.location.pathname
      const isInRoom = currentPath === `/chat/${message.room_id}`

      if (isInRoom) {
        console.log('👀 현재 채팅방에 있음, 읽음 처리:', message.room_id)
        // 현재 채팅방에 있으면 바로 읽음 처리
        try {
          await chatApi.markAsRead(message.room_id)
        } catch (error) {
          console.error('❌ 읽음 처리 실패:', error)
        }
      }

      // 채팅방 목록 갱신 (백엔드에서 unread_count 계산)
      // 읽음 처리 후 갱신해야 카운트가 0으로 유지됨
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
    })

    socket.on('error', (error: any) => {
      console.error('❌ 채팅 알림 소켓 에러:', error)
    })

    return () => {
      console.log('🔕 채팅 알림 소켓 정리')
      socket.disconnect()
      socketRef.current = null
    }
  }, [enabled, queryClient])

  return {
    isConnected: socketRef.current?.connected || false,
  }
}

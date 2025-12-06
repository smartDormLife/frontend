import { useEffect, useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import type { ChatMessage, ChatRoom } from '../types'

export function useChat(roomId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const currentRoomIdRef = useRef<number | null>(null)
  const queryClient = useQueryClient()

  // roomId 변경 시 메시지 초기화
  useEffect(() => {
    if (currentRoomIdRef.current !== roomId) {
      console.log(`채팅방 변경: ${currentRoomIdRef.current} -> ${roomId}`)
      setMessages([])

      // 이전 방을 나갈 때 채팅방 목록 갱신 (읽음 처리 반영)
      if (currentRoomIdRef.current !== null) {
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] })
      }

      currentRoomIdRef.current = roomId
    }
  }, [roomId, queryClient])

  // 소켓 연결하기
  useEffect(() => {
    if (!roomId) {
      // roomId가 없으면 (채팅방을 나갔으면) 소켓 연결 끊기
      if (socketRef.current) {
        console.log('채팅방을 나가서 소켓 연결을 끊습니다')
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
      return
    }

    // 소켓 서버 주소
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    // 새로운 소켓 연결 생성
    console.log(`채팅방 ${roomId}에 접속 중...`)
    const newSocket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    })

    socketRef.current = newSocket

    newSocket.on('connect', () => {
      console.log('✅ 소켓 연결 성공!')
      setIsConnected(true)
      // 연결 성공하면 방 입장
      newSocket.emit('joinRoom', { roomId })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ 소켓 연결 끊김')
      setIsConnected(false)
    })

    newSocket.on('newMessage', (message: ChatMessage) => {
      console.log('💬 새 메시지 수신:', message)
      setMessages((prev) => [...prev, message])
    })

    newSocket.on('error', (error: any) => {
      console.error('❌ 소켓 에러:', error)
    })

    // cleanup: 컴포넌트 unmount 또는 roomId 변경 시
    return () => {
      console.log(`채팅방 ${roomId}에서 나가기`)
      newSocket.emit('leaveRoom', { roomId })
      newSocket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [roomId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !isConnected || !roomId) {
        console.error('소켓 연결이 안 되어있어요')
        return
      }

      socketRef.current.emit('sendMessage', {
        roomId,
        content,
      })
    },
    [roomId, isConnected]
  )

  const setInitialMessages = useCallback((initialMessages: ChatMessage[]) => {
    setMessages(initialMessages)
  }, [])

  return {
    messages,
    isConnected,
    sendMessage,
    setInitialMessages,
  }
}

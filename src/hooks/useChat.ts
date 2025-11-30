import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ChatMessage } from '../types'

// 소켓 연결 (앱 전체에서 하나만 쓰기 위해 바깥에 선언)
let socket: Socket | null = null

export function useChat(roomId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // 소켓 연결하기
  useEffect(() => {
    if (!roomId) return

    // 소켓 서버 주소 (백엔드 주소로 나중에 바꿔야 함)
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    socket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    })

    socket.on('connect', () => {
      console.log('소켓 연결 성공!')
      setIsConnected(true)

      socket?.emit('joinRoom', { roomId })
    })

    socket.on('disconnect', () => {
      console.log('소켓 연결 끊김')
      setIsConnected(false)
    })

    socket.on('newMessage', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket?.emit('leaveRoom', { roomId })
      socket?.disconnect()
      socket = null
    }
  }, [roomId])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !roomId) {
        console.error('소켓 연결이 안 되어있어요')
        return
      }

      socket.emit('sendMessage', {
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

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../types";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Skeleton } from "../common/Skeleton";
import { Card } from "../common/Card";

interface ChatRoomProps {
  messages?: ChatMessage[];
  isLoading?: boolean;
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatRoom({
  messages = [],
  isLoading,
  onSend,
  disabled,
}: ChatRoomProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstUnreadRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false);

  // 첫 로딩 시 안읽은 메시지로 스크롤
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !hasScrolledToUnread) {
      const firstUnreadIndex = messages.findIndex((msg) => msg.is_unread);

      if (firstUnreadIndex !== -1) {
        // 안읽은 메시지가 있으면 첫 안읽은 메시지로 스크롤
        setTimeout(() => {
          firstUnreadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        // 모든 메시지를 읽었으면 맨 아래로 스크롤
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      setHasScrolledToUnread(true);
    }
  }, [isLoading, messages, hasScrolledToUnread]);

  // 새 메시지가 추가되면 맨 아래로 스크롤 (이미 스크롤이 완료된 후)
  useEffect(() => {
    if (hasScrolledToUnread) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, hasScrolledToUnread]);

  return (
    <div className="flex h-full flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          // 로딩 중
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className={idx % 2 === 0 ? "mr-auto w-1/2" : "ml-auto w-1/2"}
              >
                <Skeleton className="h-12 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // 메시지 없을 때
          <Card className="text-center text-surface-500">
            첫 메시지를 보내보세요!
          </Card>
        ) : (
          // 메시지 목록
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const isFirstUnread = msg.is_unread && (index === 0 || !messages[index - 1].is_unread);

              return (
                <div key={msg.msg_id}>
                  {isFirstUnread && (
                    <div ref={firstUnreadRef} className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-red-400"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-3 text-xs font-medium text-red-500">
                          안읽은 메시지
                        </span>
                      </div>
                    </div>
                  )}
                  <ChatBubble message={msg} />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={onSend} disabled={disabled} />
    </div>
  );
}

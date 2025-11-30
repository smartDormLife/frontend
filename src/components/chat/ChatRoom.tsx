import { useEffect, useRef } from "react";
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

  // 새 메시지 오면 자동으로 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            {messages.map((msg) => (
              <ChatBubble key={msg.msg_id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={onSend} disabled={disabled} />
    </div>
  );
}

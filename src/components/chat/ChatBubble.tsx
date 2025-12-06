import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { clsx } from "clsx";
import type { ChatMessage } from "../../types";
import { useAuth } from "../../hooks/useAuth";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { user } = useAuth();
  const isMine = user ? message.sender_id === user.user_id : false;

  return (
    <div
      className={clsx(
        "flex flex-col max-w-[70%]",
        isMine ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {/* 보낸 사람 이름 (상대방 메시지만) */}
      {!isMine && message.sender?.name && (
        <span className="mb-1 px-2 text-xs font-semibold text-surface-700">
          {message.sender.name}
        </span>
      )}

      {/* 말풍선 */}
      <div
        className={clsx(
          "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          isMine
            ? "bg-primary-500 text-white rounded-br-md"
            : "bg-surface-200 text-surface-900 rounded-bl-md"
        )}
      >
        {message.content}
      </div>

      {/* 시간 */}
      <span className={clsx(
        "mt-1 px-2 text-xs text-surface-400",
        isMine ? "text-right" : "text-left"
      )}>
        {dayjs(message.timestamp).fromNow()}
      </span>
    </div>
  );
}

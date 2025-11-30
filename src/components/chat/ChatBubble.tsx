import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { clsx } from "clsx";
import type { ChatMessage } from "../../types";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isMine = message.is_mine;

  return (
    <div
      className={clsx(
        "flex flex-col max-w-[70%]",
        isMine ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      {/* 보낸 사람 이름 (상대방 메시지만) */}
      {!isMine && message.sender?.name && (
        <span className="mb-1 text-xs text-surface-500">
          {message.sender.name}
        </span>
      )}

      {/* 말풍선 */}
      <div
        className={clsx(
          "rounded-2xl px-4 py-2 text-sm",
          isMine
            ? "bg-primary-600 text-white"
            : "bg-surface-100 text-surface-900"
        )}
      >
        {message.content}
      </div>

      {/* 시간 */}
      <span className="mt-1 text-xs text-surface-400">
        {dayjs(message.timestamp).fromNow()}
      </span>
    </div>
  );
}

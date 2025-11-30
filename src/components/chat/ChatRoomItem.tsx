import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import type { ChatRoom } from "../../types";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface ChatRoomItemProps {
  room: ChatRoom;
  onClick?: (roomId: number) => void;
}

export function ChatRoomItem({ room, onClick }: ChatRoomItemProps) {
  return (
    <Card
      className="cursor-pointer border border-surface-100 transition hover:-translate-y-0.5 hover:border-primary-100"
      onClick={() => onClick?.(room.room_id)}
    >
      <div className="flex items-center justify-between gap-3">
        {/* 왼쪽: 방 정보 */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-surface-900">
              {room.party?.location ?? "채팅방"}
            </h3>
            {room.unread_count && room.unread_count > 0 && (
              <Badge color="red">{room.unread_count}</Badge>
            )}
          </div>
          <p className="truncate text-sm text-surface-500">
            {room.last_message ?? "메시지가 없습니다"}
          </p>
        </div>

        {/* 오른쪽: 시간, 인원 */}
        <div className="flex flex-col items-end gap-1 text-xs text-surface-400">
          <span>{dayjs(room.created_at).fromNow()}</span>
          {room.member_count && <span>{room.member_count}명 참여</span>}
        </div>
      </div>
    </Card>
  );
}

import type { ChatRoom } from "../../types";
import { ChatRoomItem } from "./ChatRoomItem";
import { Skeleton } from "../common/Skeleton";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";

interface ChatRoomListProps {
  rooms?: ChatRoom[];
  isLoading?: boolean;
  onSelect?: (roomId: number) => void;
}

export function ChatRoomList({
  rooms = [],
  isLoading,
  onSelect,
}: ChatRoomListProps) {
  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx} className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  // 채팅방 없을 때
  if (!rooms.length) {
    return (
      <EmptyState
        title="참여 중인 채팅방이 없어요"
        description="파티에 참여하면 채팅방이 생성됩니다"
      />
    );
  }

  // 채팅방 목록
  return (
    <div className="space-y-3">
      {rooms.map((room) => (
        <ChatRoomItem key={room.room_id} room={room} onClick={onSelect} />
      ))}
    </div>
  );
}

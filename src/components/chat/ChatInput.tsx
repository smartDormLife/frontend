import { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [content, setContent] = useState("");

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-surface-100 bg-white p-4">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요"
        disabled={disabled}
        className="flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={disabled || !content.trim()}
        size="md"
      >
        전송
      </Button>
    </div>
  );
}

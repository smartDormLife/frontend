import axiosInstance from "./axiosInstance";
import type { ChatRoom, ChatMessage, ChatMember } from "../types";

export const chatApi = {
  async getRooms() {
    const { data } = await axiosInstance.get<ChatRoom[]>("/chat/rooms");
    return data;
  },

  async getRoom(roomId: number) {
    const { data } = await axiosInstance.get<ChatRoom>(`/chat/rooms/${roomId}`);
    return data;
  },

  async getMessages(roomId: number) {
    const { data } = await axiosInstance.get<ChatMessage[]>(
      `/chat/rooms/${roomId}/messages`
    );
    return data;
  },

  //soket.io안쓸때 백업용
  async sendMessage(roomId: number, content: string) {
    const { data } = await axiosInstance.post<ChatMessage>(
      `/chat/rooms/${roomId}/messages`,
      { content }
    );
    return data;
  },

  async getMembers(roomId: number) {
    const { data } = await axiosInstance.get<ChatMember[]>(
      `/chat/rooms/${roomId}/members`
    );
    return data;
  },
};

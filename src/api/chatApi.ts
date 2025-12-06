import axiosInstance from "./axiosInstance";
import type { ChatRoom, ChatMessage, ChatMember } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const chatApi = {
  async getRooms() {
    const { data } = await axiosInstance.get<ApiResponse<ChatRoom[]>>("/chat/rooms");
    return data.data;
  },

  async getRoom(roomId: number) {
    const { data } = await axiosInstance.get<ApiResponse<ChatRoom>>(`/chat/rooms/${roomId}`);
    return data.data;
  },

  async createRoom(partyId: number) {
    const { data } = await axiosInstance.post<ApiResponse<ChatRoom>>("/chat/rooms", {
      party_id: partyId,
    });
    return data.data;
  },

  async getMessages(roomId: number) {
    const { data } = await axiosInstance.get<ApiResponse<ChatMessage[]>>(
      `/chat/rooms/${roomId}/messages`
    );
    return data.data;
  },

  //soket.io안쓸때 백업용
  async sendMessage(roomId: number, content: string) {
    const { data } = await axiosInstance.post<ApiResponse<ChatMessage>>(
      `/chat/rooms/${roomId}/messages`,
      { content }
    );
    return data.data;
  },

  async getMembers(roomId: number) {
    const { data } = await axiosInstance.get<ApiResponse<ChatMember[]>>(
      `/chat/rooms/${roomId}/members`
    );
    return data.data;
  },

  async markAsRead(roomId: number) {
    const { data } = await axiosInstance.post<ApiResponse<void>>(
      `/chat/rooms/${roomId}/read`
    );
    return data.success;
  },
};

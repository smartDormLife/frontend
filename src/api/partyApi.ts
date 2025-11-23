import axiosInstance from './axiosInstance'
import type { Party } from '../types'

export const partyApi = {
  async join(partyId: number) {
    const { data } = await axiosInstance.post(`/parties/${partyId}/join`)
    return data
  },
  async leave(partyId: number) {
    const { data } = await axiosInstance.delete(`/parties/${partyId}/leave`)
    return data
  },
  async detail(partyId: number) {
    const { data } = await axiosInstance.get<Party>(`/parties/${partyId}`)
    return data
  },
}

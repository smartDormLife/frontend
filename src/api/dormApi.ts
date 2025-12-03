import axiosInstance from './axiosInstance'
import type { Dormitory } from '../types'

type DormListApiResponse = Dormitory[] | { data?: Dormitory[] }

console.log("BASE_URL = ", import.meta.env.VITE_API_URL)

export const dormApi = {
  async list() {
    const { data } = await axiosInstance.get<DormListApiResponse>('/dormitories')
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.data)) return data.data
    return []
  },
}

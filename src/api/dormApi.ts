import axiosInstance from './axiosInstance'
import type { Dormitory } from '../types'

type DormListApiResponse = Dormitory[] | { data?: Dormitory[] }

export const dormApi = {
  async list() {
    const { data } = await axiosInstance.get<DormListApiResponse>('/dormitories')
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.data)) return data.data
    return []
  },
}

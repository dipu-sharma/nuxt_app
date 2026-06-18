// src/composables/useShipping.ts
import { useApi } from './useApi'

export const useShipping = () => {
  const api = useApi()

  return {
    async getShippingZones(params: Record<string, any> = {}) {
      return await api('/api/shipping/zones', { method: 'GET', query: params })
    },
    async createShippingZone(payload: any) {
      return await api('/api/shipping/zones', { method: 'POST', body: payload })
    },
    async deleteShippingZone(id: string | number) {
      return await api(`/api/shipping/zones/${id}`, { method: 'DELETE' })
    },
  }
}

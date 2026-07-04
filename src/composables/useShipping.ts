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
    
    /** Get available shipping methods for Home */
    async getHomeShippingMethods(params: Record<string, any> = {}) {
      return await api('/api/home/shipping/methods', { method: 'GET', query: params })
    },

    /** Calculate shipping cost */
    async calculateShipping(payload: any) {
      return await api('/api/home/shipping/calculate', { method: 'POST', body: payload })
    },
  }
}

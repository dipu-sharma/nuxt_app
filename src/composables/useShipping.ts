// src/composables/useShipping.ts
import { useApi } from './useApi'

export const useShipping = () => {
  const api = useApi()

  return {
    async getShippingMethods(params: Record<string, any> = {}) {
      return await api('/api/business/shipping/', { method: 'GET', query: params })
    },
    async createShippingMethod(payload: any) {
      return await api('/api/business/shipping/', { method: 'POST', body: payload })
    },
    async updateShippingMethod(id: string, payload: any) {
      return await api(`/api/business/shipping/${id}`, { method: 'PUT', body: payload })
    },
    async deleteShippingMethod(id: string) {
      return await api(`/api/business/shipping/${id}`, { method: 'DELETE' })
    },
  }
}

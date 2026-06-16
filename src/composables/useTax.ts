// src/composables/useTax.ts
import { useApi } from './useApi'

export const useTax = () => {
  const api = useApi()

  return {
    async getTaxConfig() {
      return await api('/api/business/tax/', { method: 'GET' })
    },
    async updateTaxConfig(payload: any) {
      return await api('/api/business/tax/', { method: 'PUT', body: payload })
    },
    async createTaxConfig(payload: any) {
      return await api('/api/business/tax/', { method: 'POST', body: payload })
    },
  }
}

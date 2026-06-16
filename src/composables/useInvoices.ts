// src/composables/useInvoices.ts
import { useApi } from './useApi'

export const useInvoices = () => {
  const api = useApi()

  return {
    async getInvoices(params: Record<string, any> = {}) {
      return await api('/api/user/invoice/', { method: 'GET', query: params })
    },
    async createInvoice(payload: any) {
      return await api('/api/user/invoice/', { method: 'POST', body: payload })
    },
    async updateInvoice(id: string, payload: any) {
      return await api(`/api/user/invoice/${id}`, { method: 'PUT', body: payload })
    },
    async deleteInvoice(id: string) {
      return await api(`/api/user/invoice/${id}`, { method: 'DELETE' })
    },
  }
}

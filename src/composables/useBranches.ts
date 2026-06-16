// src/composables/useBranches.ts
import { useApi } from './useApi'

export const useBranches = () => {
  const api = useApi()

  return {
    async getBranches(params: Record<string, any> = {}) {
      return await api('/api/business/branches/', { method: 'GET', query: params })
    },
    async createBranch(payload: any) {
      return await api('/api/business/branches/', { method: 'POST', body: payload })
    },
    async updateBranch(id: string, payload: any) {
      return await api(`/api/business/branches/${id}`, { method: 'PUT', body: payload })
    },
    async deleteBranch(id: string) {
      return await api(`/api/business/branches/${id}`, { method: 'DELETE' })
    },
  }
}

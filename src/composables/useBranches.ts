// src/composables/useBranches.ts
import { useApi } from './useApi'

export const useBranches = () => {
  const api = useApi()

  return {
    async getBranches(params: Record<string, any> = {}) {
      return await api('/api/branches/', { method: 'GET', query: params })
    },
    async createBranch(payload: any) {
      return await api('/api/branches/', { method: 'POST', body: payload })
    },
    async updateBranch(id: string | number, payload: any) {
      return await api(`/api/branches/${id}`, { method: 'PUT', body: payload })
    },
    async deleteBranch(id: string | number) {
      return await api(`/api/branches/${id}`, { method: 'DELETE' })
    },
  }
}

// src/composables/useBranches.ts
import { useApi } from './useApi'

export const useBranches = () => {
  const api = useApi()

  const getHeaders = (businessId?: string | number) => {
    const headers: Record<string, string> = {}
    if (businessId) {
      headers['X-Business-ID'] = String(businessId)
    }
    return headers
  }

  return {
    async getBranches(params: Record<string, any> = {}) {
      return await api('/api/branches/', {
        method: 'GET',
        query: params,
        headers: getHeaders(params.business_id)
      })
    },
    async createBranch(payload: any) {
      return await api('/api/branches/', {
        method: 'POST',
        body: payload,
        headers: getHeaders(payload.business_id)
      })
    },
    async updateBranch(id: string | number, payload: any) {
      return await api(`/api/branches/${id}`, {
        method: 'PUT',
        body: payload,
        headers: getHeaders(payload.business_id)
      })
    },
    async deleteBranch(id: string | number) {
      return await api(`/api/branches/${id}`, { method: 'DELETE' })
    },
  }
}

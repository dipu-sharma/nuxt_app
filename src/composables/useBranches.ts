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
      const { business_id, ...query } = params
      return await api('/api/branches/', {
        method: 'GET',
        query: { ...query, business_id },
      })
    },
    async createBranch(payload: any, businessId?: string | number) {
      const bizId = businessId || payload.business_id
      const body = {
        branch_name: payload.branch_name,
        location: payload.location
      }
      return await api('/api/branches/', {
        method: 'POST',
        body,
        headers: getHeaders(bizId)
      })
    },
    async updateBranch(id: string | number, payload: any, businessId?: string | number) {
      const bizId = businessId || payload.business_id
      const body = {
        branch_name: payload.branch_name,
        location: payload.location
      }
      return await api(`/api/branches/${id}`, {
        method: 'PUT',
        body,
        headers: getHeaders(bizId)
      })
    },
    async deleteBranch(id: string | number, businessId?: string | number) {
      return await api(`/api/branches/${id}`, {
        method: 'DELETE',
        headers: getHeaders(businessId)
      })
    },
  }
}

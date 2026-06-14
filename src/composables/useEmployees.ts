// src/composables/useEmployees.ts
import { useApi } from './useApi'

export const useEmployees = () => {
  const api = useApi()

  return {
    async fetchEmployees(params = {}) {
      return await api('/api/business/members', {
        method: 'GET',
        query: params
      })
    },

    async fetchEmployeeDetails(id: string | number) {
      return await api(`/api/business/members/${id}`, {
        method: 'GET'
      })
    },

    async createEmployee(payload: any) {
      return await api('/api/business/members', {
        method: 'POST',
        body: payload
      })
    },

    async updateEmployee(id: string | number, payload: any) {
      return await api(`/api/business/members/${id}`, {
        method: 'PUT',
        body: payload
      })
    },

    async deleteEmployee(id: string | number) {
      return await api(`/api/business/members/${id}`, {
        method: 'DELETE'
      })
    },

    async bulkDelete(ids: (string | number)[]) {
      return await api('/api/business/members/bulk-delete', {
        method: 'POST',
        body: { ids }
      })
    },

    async bulkUpdate(ids: (string | number)[], updates: any) {
      return await api('/api/business/members/bulk-update', {
        method: 'PUT',
        body: { ids, updates }
      })
    }
  }
}

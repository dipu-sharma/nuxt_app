// src/composables/useBusinessProfile.ts
import { useApi } from './useApi'

export const useBusinessProfile = () => {
  const api = useApi()

  return {
    async getProfile() {
      return await api('/api/business/profile', { method: 'GET' })
    },
    async setupBusiness(payload: any) {
      return await api('/api/business/setup', { method: 'POST', body: payload })
    },
    async updateProfile(payload: any) {
      return await api('/api/business/profile', { method: 'PUT', body: payload })
    },
    async getSubscription() {
      return await api('/api/business/subscription', { method: 'GET' })
    },
    async getMembers() {
      return await api('/api/business/members', { method: 'GET' })
    },
    async createMember(payload: any) {
      return await api('/api/business/members', { method: 'POST', body: payload })
    },
    async updateMember(userId: string | number, payload: any) {
      return await api(`/api/business/members/${userId}`, { method: 'PUT', body: payload })
    },
  }
}

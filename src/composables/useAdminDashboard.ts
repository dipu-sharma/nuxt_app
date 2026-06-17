// src/composables/useAdminDashboard.ts
import { useApi } from './useApi'

export const useAdminDashboard = () => {
  const api = useApi()

  return {
    async getDashboard() {
      return await api('/api/admin/dashboard/', { method: 'GET' })
    },
  }
}

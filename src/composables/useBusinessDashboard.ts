// src/composables/useBusinessDashboard.ts
import { useApi } from './useApi'

export interface BusinessDashboardParams {
  start_date?: string
  end_date?: string
  limit?: number
}

export const useBusinessDashboard = () => {
  const api = useApi()

  return {
    async getDashboard(params: BusinessDashboardParams = { limit: 10 }) {
      const query = new URLSearchParams()
      if (params.start_date) query.append('start_date', params.start_date)
      if (params.end_date) query.append('end_date', params.end_date)
      if (params.limit !== undefined) query.append('limit', String(params.limit))

      const queryString = query.toString() ? `?${query.toString()}` : ''
      return await api(`/api/business/dashboard/${queryString}`, { method: 'GET' })
    },
  }
}

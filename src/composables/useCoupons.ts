// src/composables/useCoupons.ts
import { useApi } from './useApi'

export const useCoupons = () => {
  const api = useApi()

  return {
    /** Admin: Get all coupons */
    async getCoupons(params: Record<string, any> = {}) {
      return await api('/api/admin/coupons/', { method: 'GET', query: params })
    },

    /** Admin: Create coupon */
    async createCoupon(payload: {
      code: string
      discount_type: 'percentage' | 'fixed'
      discount_value: number
      min_order_amount?: number
      max_uses?: number
      expires_at?: string
      is_active?: boolean
    }) {
      return await api('/api/admin/coupons/', { method: 'POST', body: payload })
    },

    /** Admin: Update coupon */
    async updateCoupon(id: string, payload: any) {
      return await api(`/api/admin/coupons/${id}`, { method: 'PUT', body: payload })
    },

    /** Admin: Delete coupon */
    async deleteCoupon(id: string) {
      return await api(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    },

    /** User: Validate a coupon code */
    async validateCoupon(code: string, order_amount?: number) {
      return await api('/api/user/coupons/validate', {
        method: 'POST',
        body: { code, order_amount },
      })
    },
  }
}

// src/composables/useOrders.ts
import { useApi } from './useApi'

export const useOrders = () => {
  const api = useApi()

  return {
    /** Place a new order */
    async createOrder(payload: {
      address_id: string
      payment_method?: string
      coupon_code?: string
      notes?: string
    }) {
      return await api('/api/user/orders/create', {
        method: 'POST',
        query: { address_id: payload.address_id }
      })
    },

    /** Get all user orders (paginated) */
    async getOrders(params: Record<string, any> = {}) {
      return await api('/api/user/orders/', { method: 'GET', query: params })
    },

    /** Get order detail */
    async getOrderDetail(order_id: string) {
      return await api(`/api/user/orders/${order_id}`, { method: 'GET' })
    },

    /** Cancel an order */
    async cancelOrder(order_id: string) {
      return await api(`/api/user/orders/${order_id}/cancel`, { method: 'PUT' })
    },

    /** Track order shipping */
    async trackOrder(order_id: string) {
      return await api(`/api/user/orders/${order_id}/track`, { method: 'GET' })
    },

    // ── Admin ──────────────────────────────────
    /** Admin: Get all orders */
    async getAdminOrders(params: Record<string, any> = {}) {
      return await api('/api/admin/orders/', { method: 'GET', query: params })
    },

    /** Admin: Get order detail */
    async getAdminOrderDetail(order_id: string) {
      return await api(`/api/admin/orders/${order_id}`, { method: 'GET' })
    },

    /** Admin: Update order status */
    async updateOrderStatus(order_id: string, status: string) {
      return await api(`/api/admin/orders/${order_id}/status`, {
        method: 'PUT',
        body: { status },
      })
    },
  }
}

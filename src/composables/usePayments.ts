// src/composables/usePayments.ts
import { useApi } from './useApi'

export const usePayments = () => {
  const api = useApi()

  return {
    async getConfig() {
      return await api('/api/payments/config', { method: 'GET' })
    },
    async createIntent(payload: any) {
      return await api('/api/payments/create-intent', { method: 'POST', body: payload })
    },
    async confirmPayment(payload: any) {
      return await api('/api/payments/confirm', { method: 'POST', body: payload })
    },
    async getStatus(paymentIntentId: string) {
      return await api(`/api/payments/status/${paymentIntentId}`, { method: 'GET' })
    },
    async cancelPayment(paymentIntentId: string) {
      return await api(`/api/payments/cancel/${paymentIntentId}`, { method: 'POST' })
    },
    async getOrderPayments(orderId: string | number) {
      return await api(`/api/payments/order/${orderId}`, { method: 'GET' })
    },
    async getMyPayments() {
      return await api('/api/payments/my-payments', { method: 'GET' })
    },
    async getPaymentDetails(paymentId: string | number) {
      return await api(`/api/payments/${paymentId}`, { method: 'GET' })
    },
    async createRefund(payload: any) {
      return await api('/api/payments/refund', { method: 'POST', body: payload })
    },
    async createCustomer(payload: any) {
      return await api('/api/payments/customer/create', { method: 'POST', body: payload })
    },
  }
}

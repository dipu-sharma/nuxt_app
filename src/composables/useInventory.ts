// src/composables/useInventory.ts
import { useApi } from './useApi'
import { useAuthStore } from '~/stores/auth'

export const useInventory = () => {
  const api = useApi()
  const authStore = useAuthStore()

  const getBusinessContext = (customBusinessId?: string | number) => {
    const businessId = customBusinessId || authStore.user?.business_id || authStore.user?.business?.id
    return {
      query: businessId ? { business_id: String(businessId) } : {},
      headers: businessId ? { 'X-Business-ID': String(businessId) } : {}
    }
  }

  return {
    // Suppliers
    async getSuppliers(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/suppliers', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async getSupplier(supplierId: string | number) {
      const context = getBusinessContext()
      return await api(`/api/inventory/suppliers/${supplierId}`, {
        method: 'GET',
        query: context.query,
        headers: context.headers
      })
    },
    async createSupplier(payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api('/api/inventory/suppliers', {
        method: 'POST',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },

    // Purchase Orders
    async getPurchaseOrders(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/purchase-orders', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async createPurchaseOrder(payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api('/api/inventory/purchase-orders', {
        method: 'POST',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },

    // Stock
    async adjustStock(payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api('/api/inventory/adjust-stock', {
        method: 'POST',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },
  }
}

// src/composables/useInventory.ts
import { useApi } from './useApi'

export const useInventory = () => {
  const api = useApi()

  return {
    // Suppliers
    async getSuppliers(params: any = {}) {
      return await api('/api/inventory/suppliers', { method: 'GET', params })
    },
    async getSupplier(supplierId: string | number) {
      return await api(`/api/inventory/suppliers/${supplierId}`, { method: 'GET' })
    },
    async createSupplier(payload: any) {
      return await api('/api/inventory/suppliers', { method: 'POST', body: payload })
    },

    // Purchase Orders
    async getPurchaseOrders(params: any = {}) {
      return await api('/api/inventory/purchase-orders', { method: 'GET', params })
    },
    async createPurchaseOrder(payload: any) {
      return await api('/api/inventory/purchase-orders', { method: 'POST', body: payload })
    },

    // Stock
    async adjustStock(payload: any) {
      return await api('/api/inventory/adjust-stock', { method: 'POST', body: payload })
    },
  }
}

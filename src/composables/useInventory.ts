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
    // ─── Suppliers ────────────────────────────────────────────────────────────
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
    async updateSupplier(id: string | number, payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api(`/api/inventory/suppliers/${id}`, {
        method: 'PUT',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },
    async deleteSupplier(id: string | number, params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api(`/api/inventory/suppliers/${id}`, {
        method: 'DELETE',
        query: context.query,
        headers: context.headers
      })
    },

    // ─── Purchase Orders ──────────────────────────────────────────────────────
    async getPurchaseOrders(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/purchase-orders', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async getPurchaseOrder(id: string | number, params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api(`/api/inventory/purchase-orders/${id}`, {
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
    async updatePurchaseOrder(id: string, payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api(`/api/inventory/purchase-orders/${id}`, {
        method: 'PUT',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },
    async deletePurchaseOrder(id: string, params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api(`/api/inventory/purchase-orders/${id}`, {
        method: 'DELETE',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },

    // ─── Stock Adjustment ─────────────────────────────────────────────────────
    async adjustStock(payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api('/api/inventory/adjust-stock', {
        method: 'POST',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },

    // ─── Stock Transfers ──────────────────────────────────────────────────────
    async getStockTransfers(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/stock-transfers', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async createStockTransfer(payload: any) {
      const context = getBusinessContext(payload.business_id)
      return await api('/api/inventory/stock-transfers', {
        method: 'POST',
        body: payload,
        query: context.query,
        headers: context.headers
      })
    },

    // ─── Stock Levels & Reports ───────────────────────────────────────────────
    async getStockLevels(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/stock-levels', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async getLowStock(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/low-stock', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
    async getInventoryValuation(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/valuation', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },

    // ─── Audit Trail ──────────────────────────────────────────────────────────
    async getAdjustments(params: any = {}) {
      const context = getBusinessContext(params.business_id)
      return await api('/api/inventory/adjustments', {
        method: 'GET',
        query: { ...context.query, ...params },
        headers: context.headers
      })
    },
  }
}

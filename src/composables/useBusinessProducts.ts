// src/composables/useBusinessProducts.ts
import { useApi } from './useApi'
import { useAuthStore } from '~/stores/auth'

export const useBusinessProducts = () => {
  const api = useApi()
  const authStore = useAuthStore()

  const getBusinessId = () => {
    return authStore.user?.business_id || authStore.user?.business?.id || authStore.user?.id || ''
  }

  return {
    async getProducts(params: any = {}) {
      return await api('/api/business/products', { method: 'GET', query: params })
    },
    async getProduct(productId: string | number) {
      return await api(`/api/business/products/${productId}`, { method: 'GET' })
    },
    async createProduct(payload: any) {
      return await api('/api/business/products', { method: 'POST', body: payload })
    },
    async updateProduct(productId: string | number, payload: any) {
      return await api(`/api/business/products/${productId}`, { method: 'PUT', body: payload })
    },
    async patchProduct(productId: string | number, payload: any) {
      return await api(`/api/business/products/${productId}`, { method: 'PATCH', body: payload })
    },
    async deleteProduct(productId: string | number) {
      return await api(`/api/business/products/${productId}`, { method: 'DELETE' })
    },
    async getAdminBusinessProducts(businessId: string, params: any = {}) {
      return await api(`/api/admin/businesses/${businessId}/products`, { method: 'GET', query: params })
    },
    async addProductImage(productId: string | number, formData: FormData) {
      return await api(`/api/business/products/${productId}/images`, { method: 'POST', body: formData })
    },
    async exportCsv() {
      return await api('/api/business/products/export-csv', { method: 'POST' })
    },
  }
}


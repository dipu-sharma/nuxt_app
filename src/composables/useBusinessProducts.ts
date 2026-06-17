// src/composables/useBusinessProducts.ts
import { useApi } from './useApi'

export const useBusinessProducts = () => {
  const api = useApi()

  return {
    async getProducts(params: any = {}) {
      return await api('/api/business/products', { method: 'GET', params })
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
    async deleteProduct(productId: string | number) {
      return await api(`/api/business/products/${productId}`, { method: 'DELETE' })
    },
    async addProductImage(productId: string | number, formData: FormData) {
      return await api(`/api/business/products/${productId}/images`, { method: 'POST', body: formData })
    },
    async exportCsv() {
      return await api('/api/business/products/export-csv', { method: 'POST' })
    },
  }
}

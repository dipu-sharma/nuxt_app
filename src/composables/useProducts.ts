// src/composables/useProducts.ts
import { useApi } from './useApi'

export const useProducts = () => {
  const api = useApi()

  return {
    /**
     * Public Catalog: Fetch products by category or all
     */
    async fetchPublic(category?: string) {
      const url = category 
        ? `/api/home/products/category/${category}` 
        : '/api/home/products'
      return await api(url, { method: 'GET' })
    },

    /**
     * Get Public Product Details
     */
    async fetchProductDetails(id: string | number) {
      return await api(`/api/home/products/${id}`, {
        method: 'GET'
      })
    },

    /**
     * Global Search
     */
    async search(query: string) {
      return await api('/api/home/search/products', { 
        method: 'GET',
        query: { query } 
      })
    },

    /**
     * Business/Vendor: List products
     */
    async fetchBusinessProducts(params = {}) {
      return await api('/api/business/products', {
        method: 'GET',
        query: params
      })
    },

    /**
     * Business/Vendor: Create product
     */
    async createProduct(payload: any) {
      return await api('/api/business/products', {
        method: 'POST',
        body: payload
      })
    },

    /**
     * Business/Vendor: Update product
     */
    async updateProduct(id: string | number, payload: any) {
      return await api(`/api/business/products/${id}`, {
        method: 'PUT',
        body: payload
      })
    },

    /**
     * Business/Vendor: Delete product
     */
    async deleteProduct(id: string | number) {
      return await api(`/api/business/products/${id}`, {
        method: 'DELETE'
      })
    }
  }
}

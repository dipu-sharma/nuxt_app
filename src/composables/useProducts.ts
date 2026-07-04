// src/composables/useProducts.ts
import { useApi } from './useApi'
import { useAuthStore } from '~/stores/auth'

export const useProducts = () => {
  const api = useApi()
  const authStore = useAuthStore()

  const getBusinessId = () => {
    return authStore.user?.business_id || authStore.user?.business?.id || authStore.user?.id || ''
  }

  return {
    /**
     * Public Catalog: Fetch products by query params (search, category, limit, etc.)
     */
    async fetchPublic(params?: any) {
      return await api('/products', { method: 'GET', query: params })
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
     * Business/Vendor: Partially Update product
     */
    async patchProduct(id: string | number, payload: any) {
      return await api(`/api/business/products/${id}`, {
        method: 'PATCH',
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
    },

    /**
     * Admin: View business-wise products
     */
    async getAdminBusinessProducts(businessId: string, params: any = {}) {
      return await api(`/api/admin/businesses/${businessId}/products`, {
        method: 'GET',
        query: params
      })
    },

    /**
     * Home: Get all products
     */
    async getHomeProducts(params: any = {}) {
      return await api('/api/home/products', {
        method: 'GET',
        query: params
      })
    },

    /**
     * User: Get user recommendations
     */
    async getUserRecommendations(params: any = {}) {
      return await api('/api/user/recommendations', {
        method: 'GET',
        query: params
      })
    }
  }
}


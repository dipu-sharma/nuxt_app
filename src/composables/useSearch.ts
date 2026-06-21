// src/composables/useSearch.ts
import { useApi } from './useApi'

export const useSearch = () => {
  const api = useApi()

  return {
    async searchProducts(params: any = {}) {
      return await api('/api/home/search/products', { method: 'GET', query: params })
    },
    async autocomplete(q: string) {
      return await api('/api/home/search/autocomplete', { method: 'GET', query: { q } })
    },
    async getFilters() {
      return await api('/api/home/search/filters', { method: 'GET' })
    },
    async getTrending() {
      return await api('/api/home/search/trending', { method: 'GET' })
    },
    async getPopular() {
      return await api('/api/home/search/popular', { method: 'GET' })
    },
    async getPublicCategories() {
      return await api('/api/home/categories', { method: 'GET' })
    },
    async getProductDetail(productId: string | number) {
      return await api(`/api/home/products/${productId}`, { method: 'GET' })
    },
    async getProductsByCategory(categoryName: string, params: any = {}) {
      return await api(`/api/home/products/category/${categoryName}`, { method: 'GET', query: params })
    },
  }
}

// src/composables/useSearch.ts
import { useApi } from './useApi'

let searchController: AbortController | null = null

export const useSearch = () => {
  const api = useApi()

  return {
    async searchProducts(params: any = {}) {
      if (searchController) {
        searchController.abort()
      }
      searchController = new AbortController()

      try {
        return await api('/api/home/products', { 
          method: 'GET', 
          query: params,
          signal: searchController.signal
        })
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
          return null // Gracefully ignore aborted requests
        }
        throw err
      }
    },
    async autocomplete(q: string) {
      return await api('/api/home/search/autocomplete', { method: 'GET', query: { query: q } })
    },
    async getFilters() {
      return await api('/api/home/search/filters', { method: 'GET' })
    },
    async getTrending() {
      return await api('/api/home/search/trending', { method: 'GET' })
    },

    async getPublicCategories() {
      return await api('/api/home/categories', { method: 'GET' })
    },
    async getProductDetail(productId: string | number) {
      return await api(`/api/home/products`, { method: 'GET', query: { product_id: productId } })
    },
    async getProductsByCategory(categoryName: string, params: any = {}) {
      return await api(`/api/home/products/category/${categoryName}`, { method: 'GET', query: params })
    },
    async getProductsByCategoryId(params: { category_id: string; limit?: number; cursor?: string; min_price?: number; max_price?: number }) {
      return await api('/api/home/products/category', { method: 'GET', query: params })
    },
  }
}

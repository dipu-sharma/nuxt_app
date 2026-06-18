// src/composables/useWishlist.ts
import { useApi } from './useApi'

export const useWishlist = () => {
  const api = useApi()

  return {
    /** Get user wishlist */
    async getWishlist() {
      return await api('/api/wishlist/', { method: 'GET' })
    },

    /** Add product to wishlist */
    async addToWishlist(product_id: string | number) {
      return await api('/api/wishlist/', {
        method: 'POST',
        body: { product_id },
      })
    },

    /** Remove product from wishlist */
    async removeFromWishlist(product_id: string | number) {
      return await api(`/api/wishlist/product/${product_id}`, { method: 'DELETE' })
    },

    /** Check if product is in wishlist */
    async checkWishlist(product_id: string | number) {
      return await api(`/api/wishlist/check/${product_id}`, { method: 'POST' })
    },
  }
}

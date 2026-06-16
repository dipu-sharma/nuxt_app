// src/composables/useWishlist.ts
import { useApi } from './useApi'

export const useWishlist = () => {
  const api = useApi()

  return {
    /** Get user wishlist */
    async getWishlist() {
      return await api('/api/user/wishlist/', { method: 'GET' })
    },

    /** Add product to wishlist */
    async addToWishlist(product_id: string) {
      return await api('/api/user/wishlist/', {
        method: 'POST',
        body: { product_id },
      })
    },

    /** Remove product from wishlist */
    async removeFromWishlist(product_id: string) {
      return await api(`/api/user/wishlist/${product_id}`, { method: 'DELETE' })
    },
  }
}

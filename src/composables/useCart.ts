// src/composables/useCart.ts
import { useApi } from './useApi'

export const useCart = () => {
  const api = useApi()

  return {
    /** Get current cart */
    async getCart() {
      return await api('/api/user/cart/', { method: 'GET' })
    },

    /** Sync cart (add/update items) */
    async syncCart(items: { product_id: string; quantity: number }[]) {
      return await api('/api/user/cart/', { method: 'POST', body: { items } })
    },

    /** Add single item to cart */
    async addToCart(product_id: string, quantity: number = 1) {
      return await api('/api/user/cart/', {
        method: 'POST',
        body: { items: [{ product_id, quantity }] },
      })
    },

    /** Remove a single item from cart */
    async removeFromCart(product_id: string) {
      return await api(`/api/user/cart/${product_id}`, { method: 'DELETE' })
    },

    /** Clear entire cart */
    async clearCart() {
      return await api('/api/user/cart/', { method: 'DELETE' })
    },
  }
}

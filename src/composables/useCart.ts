// src/composables/useCart.ts
import { useApi } from './useApi'

export const useCart = () => {
  const api = useApi()

  return {
    /** Get current cart */
    async getCart() {
      return await api('/api/user/cart/', { method: 'GET' })
    },

    /** Relative Quantity Change (Add to Cart / Increment / Decrement) */
    async addToCart(product_id: string, quantity: number = 1) {
      return await api('/api/user/cart/', {
        method: 'POST',
        body: { product_id, quantity },
      })
    },

    /** Update Cart (Set Absolute Quantities) */
    async updateCart(cartId: string, items: { product_id: string; quantity: number }[]) {
      return await api(`/api/user/cart/${cartId}`, {
        method: 'PUT',
        body: { items }
      })
    },

    /** Remove a single item from cart using item_id */
    async removeFromCart(itemId: string | number) {
      return await api(`/api/user/cart/items/${itemId}`, { method: 'DELETE' })
    },

    /** Clear entire cart using cart_id */
    async clearCart(cartId: string) {
      return await api(`/api/user/cart/${cartId}`, { method: 'DELETE' })
    },
  }
}

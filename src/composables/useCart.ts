// src/composables/useCart.ts
import { useApi } from './useApi'

export const useCart = () => {
  const api = useApi()

  return {
    /**
     * Sync Cart
     */
    async syncCart(items: { product_id: string, quantity: number }[]) {
      return await api('/api/user/cart/', {
        method: 'POST',
        body: { items }
      })
    }
  }
}

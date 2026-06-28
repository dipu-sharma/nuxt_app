import { defineStore } from 'pinia'
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
  }),
  getters: {
    totalItems: (state) => {
      if (!Array.isArray(state.items)) return 0
      return state.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    },
    isInCart: (state) => (productId) => {
      if (!Array.isArray(state.items)) return false
      return state.items.some(item => String(item.product_id || item.product?.product_id) === String(productId))
    }
  },
  actions: {
    async fetchCart() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.items = []
        return
      }
      this.loading = true
      try {
        const { getCart } = useCart()
        const res = await getCart()
        // API response might be { data: { items: [] } } or just an array
        this.items = res?.data?.items || res?.data || []
      } catch (err) {
        console.error('Failed to fetch cart', err)
      } finally {
        this.loading = false
      }
    },
    async addProductToCart(productId: string, quantity: number = 1) {
      try {
        const { addToCart } = useCart()
        await addToCart(productId, quantity)
        await this.fetchCart() // Refresh cart after adding
      } catch (err) {
        console.error('Failed to add to cart', err)
        throw err
      }
    }
  }
})

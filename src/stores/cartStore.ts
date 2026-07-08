import { defineStore } from 'pinia'
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartId: '',
    items: [],
    loading: false,
    _fetchPromise: null,
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
        this.cartId = ''
        return
      }
      
      if (this._fetchPromise) {
        return this._fetchPromise
      }

      this.loading = true
      this._fetchPromise = (async () => {
        try {
          const { getCart } = useCart()
          const res = await getCart()
          this.cartId = res?.data?.cart_id || ''
          this.items = res?.data?.items || res?.data || []
        } catch (err) {
          this.cartId = ''
          this.items = []
        } finally {
          this.loading = false
          this._fetchPromise = null
        }
      })()

      return this._fetchPromise
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

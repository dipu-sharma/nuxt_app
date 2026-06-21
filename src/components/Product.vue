<template>
  <div class="px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id"
          @click="getDetails(product.product_id || product.id)"
          class="group relative bg-card/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] cursor-pointer flex flex-col overflow-hidden h-full hover:-translate-y-1">
          
          <!-- Background Glow Effect on Hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <!-- Product Image Wrapper -->
          <div class="relative overflow-hidden aspect-[4/3] bg-gradient-to-tr from-secondary/50 to-background flex items-center justify-center p-6 border-b border-white/10">
            <!-- Decorative blur behind image -->
            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl rounded-full scale-150 pointer-events-none"></div>
            
            <img v-if="product.images && product.images.length > 0"
              :src="product.images[0].image_url || product.images[0].url"
              :alt="product.product_name || product.name"
              class="relative z-10 w-full h-full object-contain transition-all duration-700 group-hover:scale-110 drop-shadow-xl" />
            
            <!-- Fallback Icon Placeholder -->
            <div v-else class="relative z-10 w-full h-full flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Icon name="mdi:shopping-outline" class="w-10 h-10 text-text opacity-40" />
              </div>
            </div>

            <!-- Discount Badge -->
            <div v-if="getDiscountPercent(product)" 
              class="absolute top-4 left-4 z-20 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-pink-500/30 transform -rotate-2 group-hover:rotate-0 transition-transform">
              {{ getDiscountPercent(product) }}% OFF
            </div>
          </div>

          <!-- Product Details Body -->
          <div class="p-6 md:p-8 flex-1 flex flex-col justify-between relative z-10 bg-gradient-to-b from-transparent to-background/40">
            <div>
              <!-- Brand/Category -->
              <span class="text-[10px] font-extrabold uppercase tracking-widest block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                {{ product.brand_name || product.category_name || product.category?.name || 'Curated' }}
              </span>

              <!-- Product Title -->
              <h3 class="text-xl font-bold tracking-tight text-text line-clamp-2 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
                {{ product.product_name || product.name }}
              </h3>

              <!-- Price Tag -->
              <div class="flex items-baseline gap-3 mb-6">
                <span class="text-3xl font-extrabold text-text tracking-tighter">
                  ₹{{ (product.selling_price || product.price)?.toLocaleString('en-IN') }}
                </span>
                <span v-if="product.product_mrp && product.product_mrp > (product.selling_price || product.price)"
                  class="text-sm text-text opacity-40 line-through font-medium">
                  ₹{{ product.product_mrp?.toLocaleString('en-IN') }}
                </span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button @click.stop="handleAddToCart(product.product_id || product.id)"
              class="relative overflow-hidden w-full rounded-2xl font-bold text-sm tracking-widest uppercase text-text/80 bg-secondary/50 hover:text-white transition-all duration-300 h-14 flex items-center justify-center group/btn shadow-sm border border-border/50 hover:border-transparent">
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div class="relative z-10 flex items-center justify-center gap-2">
                <Icon name="mdi:cart-outline" class="w-5 h-5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:scale-110" />
                <span>ADD TO CART</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '~/composables/useCart'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const { addToCart } = useCart()
const authStore = useAuthStore()

const props = defineProps({
  products: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const getDiscountPercent = (product) => {
  const price = product.selling_price || product.price
  const mrp = product.product_mrp
  if (mrp && mrp > price) {
    return Math.round(((mrp - price) / mrp) * 100)
  }
  return 0
}

const handleAddToCart = async (product_id) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await addToCart(product_id, 1)
  } catch (error) {
    console.error('Failed to add product to cart:', error)
  }
}

const getDetails = (product_id) => {
  router.push(`/products/${product_id}`)
}
</script>

<style scoped>
</style>

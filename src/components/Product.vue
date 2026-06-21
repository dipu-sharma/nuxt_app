<template>
  <div class="px-4 sm:px-6 md:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id"
          @click="getDetails(product.product_id || product.id)"
          class="group bg-card rounded-[2rem] border border-border hover:border-primary/60 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer flex flex-col overflow-hidden relative h-full">
          
          <!-- Product Image Wrapper -->
          <div class="relative overflow-hidden aspect-[4/3] bg-secondary border-b border-border flex items-center justify-center p-2">
            <img v-if="product.images && product.images.length > 0"
              :src="product.images[0].image_url || product.images[0].url"
              :alt="product.product_name || product.name"
              class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
            
            <!-- Fallback Icon Placeholder -->
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon name="mdi:shopping-outline" class="w-12 h-12 text-text opacity-30" />
            </div>

            <!-- Discount Badge -->
            <span v-if="getDiscountPercent(product)" 
              class="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              {{ getDiscountPercent(product) }}% OFF
            </span>
          </div>

          <!-- Product Details Body -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <!-- Brand/Category -->
              <span class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-1.5">
                {{ product.brand_name || product.category_name || product.category?.name || 'Curated' }}
              </span>

              <!-- Product Title -->
              <h3 class="text-lg font-light tracking-tight text-text line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300">
                {{ product.product_name || product.name }}
              </h3>

              <!-- Price Tag -->
              <div class="flex items-baseline gap-2 mb-5">
                <span class="text-2xl font-light text-text tracking-tight">
                  ₹{{ (product.selling_price || product.price)?.toLocaleString('en-IN') }}
                </span>
                <span v-if="product.product_mrp && product.product_mrp > (product.selling_price || product.price)"
                  class="text-xs text-text opacity-50 line-through font-light">
                  ₹{{ product.product_mrp?.toLocaleString('en-IN') }}
                </span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <v-btn color="primary" variant="flat" rounded="pill" block size="large"
              class="text-none tracking-widest font-medium text-white transition-all duration-300"
              elevation="0"
              @click.stop="handleAddToCart(product.product_id || product.id)">
              <template #prepend>
                <Icon name="mdi:cart-outline" class="w-4 h-4 mr-0.5" />
              </template>
              ADD TO CART
            </v-btn>
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
  router.push(`/product/${product_id}`)
}
</script>

<style scoped>
</style>

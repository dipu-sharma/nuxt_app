<template>
  <div class="w-full pb-12">
    <div class="w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-12 pt-12">
        
        <div v-for="product in products" :key="product.id"
          @click="getDetails(String(product.product_id || product.id))"
          class="group custom-card-hover relative bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:shadow-purple-700/40 transition-all duration-500 hover:bg-purple-700 cursor-pointer flex flex-col pt-16 px-4 pb-5 text-center h-full">
          
          <!-- Image Popping Out of Top -->
          <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 z-10 transition-transform duration-500 group-hover:-translate-y-2">
            <img v-if="product.images && product.images.length > 0"
              :src="product.images[0].image_url || product.images[0].url"
              :alt="product.product_name || product.name"
              class="w-full h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)] transition-all duration-500" />
            
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl shadow-md border border-gray-100">
              <Icon name="mdi:image-outline" class="w-10 h-10 text-gray-300" />
            </div>

            <!-- Discount Badge -->
            <div v-if="getDiscountPercent(product)" 
              class="absolute top-2 -right-3 z-20 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-md">
              -{{ getDiscountPercent(product) }}%
            </div>
          </div>

          <!-- Product Details Body -->
          <div class="flex-1 flex flex-col justify-between relative z-10">
            <div>
              <!-- Product Title -->
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-white transition-colors duration-300 line-clamp-1">
                {{ product.product_name || product.name }}
              </h3>

              <!-- Description -->
              <p class="text-[11px] text-gray-500 group-hover:text-purple-200 mt-2 line-clamp-2 transition-colors duration-300 leading-relaxed">
                {{ product.description || 'Premium quality handcrafted product designed to elevate your everyday lifestyle with perfect functionality.' }}
              </p>

              <!-- Price & Swatches -->
              <div class="flex items-center justify-between mt-4 mb-5">
                <!-- Color Swatches (Decorative) -->
                <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div class="w-2.5 h-2.5 bg-sky-500 rounded-[2px] shadow-sm"></div>
                  <div class="w-2.5 h-2.5 bg-orange-500 rounded-[2px] shadow-sm"></div>
                  <div class="w-2.5 h-2.5 bg-emerald-500 rounded-[2px] shadow-sm"></div>
                  <div class="w-2.5 h-2.5 bg-purple-500 rounded-[2px] shadow-sm"></div>
                </div>

                <!-- Price -->
                <div class="text-base font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                  ₹{{ (product.selling_price || product.price)?.toLocaleString('en-IN') }}
                </div>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button @click.stop="handleAddToCart(String(product.product_id || product.id))"
              class="mx-auto w-[140px] bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3 rounded-full uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5">
              ADD TO CART
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
.custom-card-hover:hover {
  background-color: #7922a6 !important;
}
</style>

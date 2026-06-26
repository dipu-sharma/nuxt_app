<template>
  <div class="w-full pb-16">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-16">

      <div v-for="product in products" :key="product.id" @click="getDetails(String(product.product_id || product.id))"
        class="product-card group relative cursor-pointer flex flex-col h-full">

        <!-- Card Shell -->
        <div
          class="card-inner relative flex flex-col flex-1 rounded-[1.8rem] overflow-visible transition-all duration-500 ease-out bg-card border border-border/40 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07)] group-hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] group-hover:-translate-y-2">

          <!-- Ambient glow on hover -->
          <div
            class="absolute inset-0 rounded-[1.8rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          </div>

          <!-- Top Image Platform -->
          <div class="relative mx-auto mt-6 mb-3 w-32 h-32 flex items-center justify-center">
            <!-- Image glow circle -->
            <div
              class="absolute inset-0 rounded-full bg-gradient-to-br from-secondary to-background scale-110 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <!-- Spinning ring on hover -->
            <div
              class="absolute inset-[-6px] rounded-full border-2 border-dashed border-primary/0 group-hover:border-primary/30 transition-all duration-700 group-hover:rotate-[360deg]"
              style="transition: border-color 0.5s, transform 3s linear;"></div>

            <!-- Product Image -->
            <div class="relative z-10 w-full h-full">
              <img v-if="product.images && product.images.length > 0"
                :src="product.images[0].image_url || product.images[0].url" :alt="product.product_name || product.name"
                class="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110" />
              <div v-else
                class="w-full h-full flex items-center justify-center bg-secondary/60 rounded-full border border-border/60">
                <Icon name="mdi:image-outline" class="w-10 h-10 text-text/20" />
              </div>
            </div>

            <!-- Discount Badge -->
            <div v-if="getDiscountPercent(product)"
              class="absolute -top-1 -right-3 z-20 flex items-center gap-0.5 bg-gradient-to-br from-rose-500 to-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg shadow-rose-500/40">
              <Icon name="mdi:sale" class="w-3 h-3" />
              {{ getDiscountPercent(product) }}% OFF
            </div>
          </div>

          <!-- Card Body -->
          <div class="flex-1 flex flex-col px-5 pb-5">
            <!-- Category tag -->
            <span v-if="product.category?.name || product.category_name"
              class="self-center text-[9px] font-bold uppercase tracking-[0.15em] text-primary/70 bg-primary/8 px-3 py-0.5 rounded-full border border-primary/15 mb-3">
              {{ product.category?.name || product.category_name }}
            </span>

            <!-- Product Title -->
            <h3
              class="text-sm font-extrabold text-text group-hover:text-primary transition-colors duration-300 line-clamp-2 text-center tracking-tight leading-snug mb-1">
              {{ product.product_name || product.name }}
            </h3>

            <!-- Stars decoration -->
            <div
              class="flex justify-center gap-0.5 my-2 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
              <Icon v-for="i in 5" :key="i" name="mdi:star" class="w-3 h-3 text-amber-400" />
            </div>

            <!-- Price Row -->
            <div class="flex items-center justify-center gap-2 mt-auto mb-4">
              <span v-if="product.product_mrp && product.product_mrp > (product.selling_price || product.price)"
                class="text-xs text-text/40 line-through font-medium">
                ₹{{ product.product_mrp?.toLocaleString('en-IN') }}
              </span>
              <span class="text-xl font-black text-text group-hover:text-primary transition-colors duration-300">
                ₹{{ (product.selling_price || product.price)?.toLocaleString('en-IN') }}
              </span>
            </div>

            <!-- Add to Cart Button - Neon Gradient -->
            <button @click.stop="handleAddToCart(String(product.product_id || product.id))"
              class="neon-cart-btn relative w-full rounded-2xl py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-95 flex justify-center items-center gap-2 overflow-hidden">
              <!-- Animated gradient background -->
              <div class="btn-gradient-bg absolute inset-0 rounded-2xl"></div>
              <!-- Neon shimmer sweep -->
              <div class="btn-shimmer absolute inset-0 rounded-2xl"></div>
              <!-- Neon outer glow ring -->
              <div class="btn-glow-ring absolute inset-[-2px] rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <!-- Label -->
              <span class="relative z-10 text-white flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                <Icon name="mdi:cart-arrow-down" class="w-4 h-4" />
                Add to Cart
              </span>
            </button>
          </div>
        </div>

        <!-- Floating quick-view on hover -->
        <div
          class="quick-view absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div
            class="bg-background/80 backdrop-blur-sm text-text/70 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-border/50 shadow-sm flex items-center gap-1.5">
            <Icon name="mdi:eye-outline" class="w-3.5 h-3.5" />
            View
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
.product-card {
  perspective: 800px;
}

.card-inner {
  transform-style: preserve-3d;
}

/* ───── Neon Add to Cart Button ───── */

/* Always-on animated gradient fill */
.btn-gradient-bg {
  background: linear-gradient(
    270deg,
    #6366f1,
    #8b5cf6,
    #ec4899,
    #06b6d4,
    #6366f1
  );
  background-size: 300% 300%;
  animation: neon-gradient 4s ease infinite;
}

@keyframes neon-gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Shimmer sweep on top */
.btn-shimmer {
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: neon-shimmer 2s linear infinite;
}

@keyframes neon-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* Neon pulsing glow ring around button */
.btn-glow-ring {
  background: transparent;
  box-shadow:
    0 0 8px 2px rgba(139, 92, 246, 0.7),
    0 0 20px 4px rgba(99, 102, 241, 0.5),
    0 0 40px 6px rgba(236, 72, 153, 0.3);
  animation: neon-pulse 2s ease-in-out infinite;
}

@keyframes neon-pulse {
  0%, 100% {
    box-shadow:
      0 0 8px 2px rgba(139, 92, 246, 0.7),
      0 0 20px 4px rgba(99, 102, 241, 0.5),
      0 0 40px 6px rgba(236, 72, 153, 0.3);
  }
  50% {
    box-shadow:
      0 0 12px 4px rgba(236, 72, 153, 0.8),
      0 0 30px 6px rgba(139, 92, 246, 0.6),
      0 0 50px 10px rgba(6, 182, 212, 0.3);
  }
}

.neon-cart-btn:hover {
  box-shadow:
    0 0 15px rgba(139, 92, 246, 0.6),
    0 0 30px rgba(99, 102, 241, 0.4),
    0 8px 25px rgba(236, 72, 153, 0.3);
  transform: translateY(-1px);
}

.neon-cart-btn:active {
  transform: scale(0.95);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}
</style>

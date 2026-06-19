<template>
  <div class="min-h-screen bg-background text-text py-12 px-4 sm:px-6 font-sans">
    
    <!-- Loading State -->
    <div v-if="loading" class="max-w-5xl mx-auto flex flex-col items-center justify-center py-32">
      <v-progress-circular indeterminate color="primary" :size="50" :width="2" class="opacity-50" />
    </div>

    <!-- Product Detail Page -->
    <div v-else-if="product" class="max-w-5xl mx-auto">
      
      <!-- Minimal Breadcrumb -->
      <nav class="flex items-center gap-2 text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-10">
        <NuxtLink to="/" class="hover:opacity-80">Home</NuxtLink>
        <span class="opacity-40">/</span>
        <NuxtLink to="/products" class="hover:opacity-80">Products</NuxtLink>
        <span class="opacity-40">/</span>
        <span class="text-text opacity-70 truncate max-w-[150px] sm:max-w-xs">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
        
        <!-- Left Side: Product Images -->
        <div>
          <!-- Large Preview Image -->
          <div class="rounded-[2.5rem] overflow-hidden bg-card border border-border shadow-sm flex items-center justify-center aspect-[4/3] relative p-6">
            <img v-if="selectedImage" :src="selectedImage" :alt="product.name" class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            <div v-else class="w-full h-full flex items-center justify-center text-7xl opacity-20">🛍️</div>
          </div>
          
          <!-- Thumbnail Selector -->
          <div v-if="product.images?.length > 1" class="flex flex-wrap gap-3 mt-4">
            <button v-for="(img, i) in product.images" :key="i" @click="selectedImage = img.url"
              class="w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-card"
              :class="selectedImage === img.url ? 'border-primary' : 'border-transparent hover:border-border'">
              <img :src="img.url" class="w-full h-full object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal" />
            </button>
          </div>
        </div>

        <!-- Right Side: Info & Actions -->
        <div class="flex flex-col">
          <!-- Brand / Tag -->
          <span class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">
            {{ product.brand_name || product.category?.name || 'Curated Collection' }}
          </span>

          <!-- Product Name -->
          <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-text mb-4">
            {{ product.name }}
          </h1>

          <!-- Badges & Ratings -->
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <div v-if="product.rating" class="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
              ⭐ <span class="text-text">{{ product.rating }}</span>
              <span class="text-xs text-text opacity-50 font-normal">({{ product.review_count || 0 }} reviews)</span>
            </div>
            
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              :class="product.stock_quantity > 0 
                ? 'bg-primary/10 text-primary' 
                : 'bg-red-500/10 text-red-550'">
              {{ product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <!-- Price Display -->
          <p class="text-4xl font-light text-text tracking-tight mb-6">
            ₹{{ product.price?.toLocaleString('en-IN') }}
          </p>

          <!-- Description -->
          <p class="text-sm text-text opacity-70 font-medium leading-relaxed mb-8">
            {{ product.description }}
          </p>

          <!-- Add to Cart Block -->
          <div class="space-y-6 pt-6 border-t border-border">
            <!-- Quantity Selector -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-widest text-text opacity-50">Select Quantity</span>
              <div class="flex items-center bg-card border border-border rounded-full px-2 py-1 shadow-sm">
                <button @click="qty = Math.max(1, qty - 1)" 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-text opacity-70 hover:bg-secondary transition-colors text-lg font-light">
                  −
                </button>
                <span class="w-12 text-center text-sm font-semibold text-text">
                  {{ qty }}
                </span>
                <button @click="qty++" 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-text opacity-70 hover:bg-secondary transition-colors text-lg font-light">
                  +
                </button>
              </div>
            </div>

            <!-- Main CTA Actions -->
            <div class="flex gap-4">
              <v-btn color="primary" variant="flat" rounded="pill" size="x-large" :disabled="addingCart || product.stock_quantity === 0"
                class="flex-1 text-none tracking-widest font-medium text-white shadow-md" elevation="0"
                @click="addToCart">
                <template #prepend>
                  <Icon name="mdi:cart-outline" class="w-5 h-5 mr-1" />
                </template>
                {{ addingCart ? 'ADDING...' : 'ADD TO CART' }}
              </v-btn>

              <button @click="addToWishlist"
                class="w-14 h-14 rounded-full border border-border flex items-center justify-center hover:bg-card text-text opacity-50 hover:text-red-500 transition-all duration-300 shadow-sm flex-shrink-0">
                <Icon :name="inWishlist ? 'mdi:heart' : 'mdi:heart-outline'" class="w-6 h-6" :class="{'text-red-500': inWishlist}" />
              </button>
            </div>
          </div>

          <!-- Metadata Tags -->
          <div class="mt-8 pt-6 border-t border-border text-[10px] text-text opacity-50 font-bold uppercase tracking-widest space-y-2">
            <p v-if="product.sku">SKU: <span class="text-text opacity-80 font-semibold">{{ product.sku }}</span></p>
            <p v-if="product.category?.name">Category: <span class="text-text opacity-80 font-semibold">{{ product.category.name }}</span></p>
          </div>
        </div>
      </div>

      <!-- Reviews & Community section -->
      <section class="bg-card rounded-[2.5rem] p-8 sm:p-10 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] mt-16">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 class="text-2xl font-light tracking-tight text-text">Customer Reviews</h2>
            <p class="text-text opacity-50 text-xs font-semibold tracking-wide mt-1">Read honest feedback from verified buyers.</p>
          </div>
          <v-btn color="primary" variant="outlined" rounded="pill" @click="showReviewForm = !showReviewForm" class="text-none tracking-widest font-semibold">
            {{ showReviewForm ? 'Cancel Review' : 'Write a Review' }}
          </v-btn>
        </div>

        <!-- Write Review Form Container -->
        <div v-if="showReviewForm" class="bg-secondary/40 rounded-[2rem] p-6 sm:p-8 border border-border mb-8">
          <h3 class="text-lg font-light text-text mb-4 tracking-tight">Share your experience</h3>
          
          <div class="flex items-center gap-3 mb-6">
            <span class="text-xs font-bold uppercase tracking-widest text-text opacity-50">Rating:</span>
            <div class="flex gap-1.5">
              <button v-for="s in 5" :key="s" @click="reviewForm.rating = s"
                class="text-2xl transition-transform hover:scale-125 focus:outline-none"
                :class="s <= reviewForm.rating ? 'text-yellow-400' : 'text-text opacity-30'">★</button>
            </div>
          </div>

          <div class="space-y-4 mb-6">
            <input v-model="reviewForm.title" placeholder="Summary title"
              class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:border-primary text-text shadow-sm" />
            
            <textarea v-model="reviewForm.content" placeholder="What did you like or dislike?" rows="4"
              class="w-full px-5 py-3.5 bg-card border border-border rounded-[1.5rem] text-sm resize-none focus:outline-none focus:border-primary text-text shadow-sm"></textarea>
          </div>

          <v-btn color="primary" variant="flat" rounded="pill" size="large" :disabled="submittingReview" @click="submitReview"
            class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
            {{ submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW' }}
          </v-btn>
        </div>

        <!-- Reviews List -->
        <div v-if="reviews.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="mdi:message-draw" class="w-6 h-6 text-text opacity-30" />
          </div>
          <p class="text-text opacity-50 text-sm font-medium">No reviews yet. Be the first to share your thoughts!</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="review in reviews" :key="review.id"
            class="bg-secondary/20 rounded-[2rem] p-6 sm:p-8 border border-border/45 relative flex flex-col sm:flex-row gap-6">
            
            <!-- Review Details Left -->
            <div class="flex-shrink-0 sm:w-40">
              <p class="font-semibold text-text truncate text-sm mb-1">
                {{ review.user?.username || 'Verified Buyer' }}
              </p>
              <p class="text-[10px] text-text opacity-40 font-bold uppercase tracking-widest mb-3">
                {{ new Date(review.created_at).toLocaleDateString() }}
              </p>
              <!-- Star rating badges -->
              <div class="text-yellow-400 text-sm">
                {{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
              </div>
            </div>

            <!-- Review Message Right -->
            <div class="flex-1">
              <h4 v-if="review.title" class="font-bold text-text text-base mb-2">
                {{ review.title }}
              </h4>
              <p class="text-text opacity-80 text-sm leading-relaxed font-medium">
                {{ review.content || review.comment }}
              </p>
            </div>

          </div>
        </div>

      </section>
    </div>

    <!-- Product Not Found -->
    <div v-else class="text-center py-32 px-4 max-w-sm mx-auto">
      <div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
        <Icon name="mdi:alert-circle-outline" class="w-8 h-8 text-text opacity-40" />
      </div>
      <h3 class="text-xl font-light text-text mb-2">Product Not Found</h3>
      <p class="text-text opacity-60 text-sm mb-8 leading-relaxed">The product you are looking for does not exist or has been removed.</p>
      <v-btn color="primary" variant="flat" rounded="pill" to="/products" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
        RETURN TO SHOP
      </v-btn>
    </div>

  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({ title: 'Product', layout: 'default' })

const route = useRoute()
const productId = route.params.id

const loading = ref(true)
const product = ref(null)
const reviews = ref([])
const selectedImage = ref(null)
const qty = ref(1)
const addingCart = ref(false)
const inWishlist = ref(false)
const showReviewForm = ref(false)
const submittingReview = ref(false)
const reviewForm = ref({ rating: 5, title: '', content: '' })

const addToCart = async () => {
  addingCart.value = true
  try {
    const { addToCart: doAdd } = useCart()
    await doAdd(String(productId), qty.value)
    toast.success('Added to cart successfully!')
  } catch {
    toast.error('Failed to add to cart')
  } finally {
    addingCart.value = false
  }
}

const addToWishlist = async () => {
  try {
    const { addToWishlist: doAdd, removeFromWishlist } = useWishlist()
    if (inWishlist.value) {
      await removeFromWishlist(String(productId))
      inWishlist.value = false
      toast.success('Removed from wishlist')
    } else {
      await doAdd(String(productId))
      inWishlist.value = true
      toast.success('Added to wishlist ❤️')
    }
  } catch {
    toast.error('Failed to update wishlist')
  }
}

const submitReview = async () => {
  if (!reviewForm.value.content) return toast.error('Please write a review comment')
  submittingReview.value = true
  try {
    const { submitReview: doSubmit } = useReviews()
    await doSubmit({ product_id: String(productId), rating: reviewForm.value.rating, comment: reviewForm.value.content })
    toast.success('Review submitted successfully!')
    showReviewForm.value = false
    reviewForm.value = { rating: 5, title: '', content: '' }
    loadReviews()
  } catch {
    toast.error('Failed to submit review')
  } finally {
    submittingReview.value = false
  }
}

const loadReviews = async () => {
  try {
    const { getProductReviews } = useReviews()
    const res = await getProductReviews(String(productId))
    reviews.value = res?.data?.items || res?.data || []
  } catch {
    reviews.value = []
  }
}

onMounted(async () => {
  try {
    const { getProductDetail } = useSearch()
    const res = await getProductDetail(productId)
    product.value = res?.data || res
    if (!product.value || !product.value.name) {
      throw new Error('Empty product details')
    }
  } catch {
    product.value = null
  } finally {
    if (product.value?.images?.[0]?.url) {
      selectedImage.value = product.value.images[0].url
    } else if (product.value?.images?.[0]?.image_url) {
      selectedImage.value = product.value.images[0].image_url
    }
    useHead({ title: product.value?.name || 'Product' })
    loading.value = false
  }
  loadReviews()

  try {
    const { checkWishlist } = useWishlist()
    const checkRes = await checkWishlist(productId)
    inWishlist.value = !!(checkRes?.data?.in_wishlist || checkRes?.in_wishlist || checkRes?.data || checkRes)
  } catch {}
})
</script>

<style scoped>
</style>

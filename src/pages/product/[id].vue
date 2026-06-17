<template>
	<div class="min-h-screen" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text))">
		<!-- Loading -->
		<div v-if="loading" class="max-w-5xl mx-auto p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="rounded-2xl h-96 animate-pulse" style="background-color: rgb(var(--color-card))" />
				<div class="space-y-4 pt-4">
					<div class="h-6 rounded animate-pulse" style="background-color: rgb(var(--color-card))" />
					<div class="h-4 w-3/4 rounded animate-pulse" style="background-color: rgb(var(--color-card))" />
					<div class="h-10 w-32 rounded animate-pulse" style="background-color: rgb(var(--color-card))" />
				</div>
			</div>
		</div>

		<!-- Product Detail -->
		<div v-else-if="product" class="max-w-5xl mx-auto p-6">
			<!-- Breadcrumb -->
			<nav class="flex items-center gap-2 text-sm opacity-60 mb-6">
				<NuxtLink to="/">Home</NuxtLink>
				<span>/</span>
				<NuxtLink to="/products">Products</NuxtLink>
				<span>/</span>
				<span>{{ product.name }}</span>
			</nav>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				<!-- Images -->
				<div>
					<div class="rounded-2xl overflow-hidden mb-3 h-96"
						style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
						<img v-if="selectedImage" :src="selectedImage" :alt="product.name" class="w-full h-full object-cover" />
						<div v-else class="w-full h-full flex items-center justify-center text-8xl opacity-30">🛍️</div>
					</div>
					<div class="flex gap-2">
						<button v-for="(img, i) in product.images" :key="i" @click="selectedImage = img.url"
							class="w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
							:style="selectedImage === img.url ? 'border-color: rgb(var(--color-primary))' : 'border-color: transparent'">
							<img :src="img.url" class="w-full h-full object-cover" />
						</button>
					</div>
				</div>

				<!-- Info -->
				<div class="flex flex-col">
					<h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
					<div class="flex items-center gap-3 mb-4">
						<div v-if="product.rating" class="flex items-center gap-1 text-yellow-500 text-sm">
							⭐ {{ product.rating }} ({{ product.review_count || 0 }} reviews)
						</div>
						<span class="px-2 py-0.5 text-xs rounded-full"
							:class="product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
							{{ product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock' }}
						</span>
					</div>
					<p class="text-3xl font-bold mb-4" style="color: rgb(var(--color-primary))">${{ product.price }}</p>
					<p class="text-sm opacity-70 leading-relaxed mb-6">{{ product.description }}</p>

					<div class="flex items-center gap-3 mb-4">
						<label class="text-sm font-medium">Qty:</label>
						<div class="flex items-center gap-2">
							<button @click="qty = Math.max(1, qty - 1)" class="w-8 h-8 rounded-lg border flex items-center justify-center"
								style="border-color: rgb(var(--color-border))">−</button>
							<span class="w-8 text-center font-medium">{{ qty }}</span>
							<button @click="qty++" class="w-8 h-8 rounded-lg border flex items-center justify-center"
								style="border-color: rgb(var(--color-border))">+</button>
						</div>
					</div>

					<div class="flex gap-3 mt-auto">
						<button @click="addToCart" :disabled="addingCart || product.stock_quantity === 0"
							class="flex-1 py-3 rounded-xl font-medium text-white transition-opacity disabled:opacity-50"
							style="background-color: rgb(var(--color-primary))">
							{{ addingCart ? 'Adding...' : '🛒 Add to Cart' }}
						</button>
						<button @click="addToWishlist"
							class="px-4 py-3 rounded-xl border transition-colors"
							style="border-color: rgb(var(--color-border))">
							{{ inWishlist ? '❤️' : '🤍' }}
						</button>
					</div>

					<!-- Meta -->
					<div class="mt-6 pt-4 border-t text-sm opacity-60 space-y-1"
						style="border-color: rgb(var(--color-border))">
						<p v-if="product.sku">SKU: {{ product.sku }}</p>
						<p v-if="product.category?.name">Category: {{ product.category.name }}</p>
					</div>
				</div>
			</div>

			<!-- Reviews Section -->
			<div class="rounded-2xl p-6" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold">Reviews ({{ reviews.length }})</h2>
					<button @click="showReviewForm = !showReviewForm" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						Write Review
					</button>
				</div>

				<!-- Review Form -->
				<div v-if="showReviewForm" class="rounded-xl p-4 mb-6"
					style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border))">
					<div class="flex items-center gap-2 mb-3">
						<span class="text-sm font-medium">Rating:</span>
						<div class="flex gap-1">
							<button v-for="s in 5" :key="s" @click="reviewForm.rating = s"
								class="text-xl transition-transform hover:scale-110"
								:class="s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'">★</button>
						</div>
					</div>
					<input v-model="reviewForm.title" placeholder="Review title"
						class="w-full px-4 py-2 rounded-lg text-sm mb-2"
						style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<textarea v-model="reviewForm.content" placeholder="Share your experience..." rows="3"
						class="w-full px-4 py-2 rounded-lg text-sm resize-none mb-3"
						style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))"></textarea>
					<button @click="submitReview" :disabled="submittingReview"
						class="px-5 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ submittingReview ? 'Submitting...' : 'Submit Review' }}
					</button>
				</div>

				<div v-if="reviews.length === 0" class="text-center py-8 opacity-50">No reviews yet. Be the first!</div>
				<div v-else class="space-y-4">
					<div v-for="review in reviews" :key="review.id"
						class="p-4 rounded-xl" style="background-color: rgb(var(--color-background))">
						<div class="flex items-center justify-between mb-2">
							<span class="font-medium text-sm">{{ review.user?.username || 'Customer' }}</span>
							<span class="text-yellow-400 text-sm">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span>
						</div>
						<p v-if="review.title" class="font-medium text-sm mb-1">{{ review.title }}</p>
						<p class="text-sm opacity-70">{{ review.content || review.comment }}</p>
						<p class="text-xs opacity-40 mt-2">{{ new Date(review.created_at).toLocaleDateString() }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Not Found -->
		<div v-else class="text-center py-24 opacity-50">
			<div class="text-6xl mb-4">🔍</div>
			<p>Product not found</p>
			<NuxtLink to="/products" class="mt-4 inline-block text-sm underline">Browse Products</NuxtLink>
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
		toast.success('Added to cart!')
	} catch { toast.error('Failed to add to cart') }
	finally { addingCart.value = false }
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
	} catch { toast.error('Failed to update wishlist') }
}

const submitReview = async () => {
	if (!reviewForm.value.content) return toast.error('Please write a review')
	submittingReview.value = true
	try {
		const { submitReview: doSubmit } = useReviews()
		await doSubmit({ product_id: String(productId), rating: reviewForm.value.rating, comment: reviewForm.value.content })
		toast.success('Review submitted!')
		showReviewForm.value = false
		reviewForm.value = { rating: 5, title: '', content: '' }
		loadReviews()
	} catch { toast.error('Failed to submit review') }
	finally { submittingReview.value = false }
}

const loadReviews = async () => {
	try {
		const { getProductReviews } = useReviews()
		const res = await getProductReviews(String(productId))
		reviews.value = res?.data?.items || res?.data || []
	} catch { reviews.value = [] }
}

onMounted(async () => {
	try {
		const { getProductDetail } = useSearch()
		const res = await getProductDetail(productId)
		product.value = res?.data || res
		if (product.value?.images?.[0]?.url) {
			selectedImage.value = product.value.images[0].url
		}
		useHead({ title: product.value?.name || 'Product' })
	} catch { product.value = null }
	finally { loading.value = false }
	loadReviews()
})
</script>

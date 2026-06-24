<template>
	<div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30">
		<!-- Abstract Cool Color Gradient Blobs -->
		<div class="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
		<div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/20 via-blue-500/20 to-transparent rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

		<div class="relative z-10 max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-12">
			<!-- Back Button -->
			<button
				@click="goBack"
				class="mb-10 flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-text opacity-70 hover:opacity-100 hover:text-primary transition-all group"
			>
				<div class="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
					<Icon name="mdi:arrow-left" class="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" />
				</div>
				Back to Collection
			</button>

			<!-- Loading -->
			<div v-if="loading" class="flex flex-col items-center justify-center py-40">
				<div class="relative">
					<div class="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
					<div class="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
				</div>
				<p class="mt-8 text-lg text-text font-medium opacity-70 tracking-widest uppercase text-sm">Discovering Details...</p>
			</div>

			<!-- Error -->
			<div v-else-if="error" class="text-center py-40 max-w-lg mx-auto">
				<div class="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10">
					<Icon name="mdi:alert-circle-outline" class="w-12 h-12 text-red-500" />
				</div>
				<h2 class="text-3xl font-bold text-text mb-4">Something went wrong</h2>
				<p class="text-text opacity-60 mb-8">{{ error }}</p>
				<button
					@click="fetchProduct"
					class="px-10 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all"
				>
					Try Again
				</button>
			</div>

			<!-- Product Content -->
			<div v-else-if="product" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				
				<!-- Images Section -->
				<div class="lg:col-span-6 space-y-6">
					<div class="group relative rounded-[2.5rem] overflow-hidden bg-secondary border border-border shadow-inner aspect-[4/5] flex items-center justify-center">
						<div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
						<img
							v-if="mainImage"
							:src="mainImage"
							:alt="product.name || 'Product image'"
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div v-else class="w-full h-full flex flex-col items-center justify-center bg-gray-50/50">
							<Icon name="mdi:image-outline" class="w-24 h-24 text-gray-300 mb-4" />
							<span class="text-sm font-medium text-gray-400">No Image Available</span>
						</div>
						<div
							v-if="!product.in_stock"
							class="absolute top-6 right-6 bg-red-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase shadow-lg shadow-red-500/30 border border-white/20"
						>
							Out of Stock
						</div>
					</div>

					<!-- Thumbnails -->
					<div v-if="product?.images?.length > 1" class="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
						<button
							v-for="(img, index) in product.images"
							:key="index"
							@click="selectedImageIndex = Number(index)"
							class="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-secondary"
							:class="selectedImageIndex === index ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100'"
						>
							<img :src="img.url || img.image_url || img" :alt="`${product.name} view ${Number(index) + 1}`" class="w-full h-full object-cover" />
						</button>
					</div>
				</div>

				<!-- Info Section -->
				<div class="lg:col-span-6 flex flex-col justify-center h-full space-y-10">
					<div>
						<div class="flex items-center gap-3 mb-4">
							<span class="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full tracking-widest border border-primary/20">
								{{ product.category?.name || product.category || 'Uncategorized' }}
							</span>
							<span v-if="product.sku" class="text-text opacity-40 text-sm font-medium">
								SKU: {{ product.sku }}
							</span>
						</div>
						
						<h1 class="text-4xl lg:text-5xl font-extrabold bg-clip-text bg-gradient-to-r from-text to-text/60 leading-tight mb-6">
							{{ product.name }}
						</h1>

						<div class="flex items-end gap-6">
							<span class="text-5xl lg:text-6xl font-black bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 drop-shadow-sm">
								₹{{ product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00' }}
							</span>
							<span v-if="product.product_mrp > product.price" class="text-2xl text-text opacity-30 line-through mb-2 font-bold">
								₹{{ product.product_mrp.toLocaleString('en-IN') }}
							</span>
						</div>
					</div>

					<div class="w-full h-px bg-gradient-to-r from-border via-border/50 to-transparent"></div>

					<!-- Description -->
					<div>
						<h3 class="text-sm font-bold uppercase tracking-widest text-text opacity-50 mb-4">The Details</h3>
						<p class="text-text/80 leading-relaxed text-lg font-light">
							{{ product.description || 'Experience the perfect blend of quality and style with this premium product.' }}
						</p>
					</div>

					<!-- Actions -->
					<div class="flex flex-col sm:flex-row gap-5 pt-4">
						<button
							@click="handleAddToCart"
							:disabled="addingToCart || !product.in_stock"
							class="relative flex-1 group overflow-hidden rounded-[2rem] font-bold text-lg text-white shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:-translate-y-1 hover:shadow-2xl h-16"
							:class="product.in_stock ? 'shadow-indigo-500/25 hover:shadow-purple-500/40' : 'shadow-none'"
						>
							<div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-transform duration-500 group-hover:scale-110"></div>
							<div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="relative flex items-center justify-center gap-3 h-full">
								<Icon v-if="addingToCart" name="mdi:loading" class="w-6 h-6 animate-spin" />
								<Icon v-else-if="product.in_stock" name="mdi:cart-plus" class="w-6 h-6" />
								{{ addingToCart ? 'Adding to Cart...' : product.in_stock ? 'Add to Cart' : 'Out of Stock' }}
							</div>
						</button>

						<button
							@click="toggleFavorite"
							class="w-16 h-16 rounded-[2rem] border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0"
							:class="isFavorite ? 'border-red-500 bg-red-500/10 text-red-500 shadow-lg shadow-red-500/20' : 'border-border text-text opacity-50 hover:opacity-100 hover:border-text'"
						>
							<Icon :name="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'" class="w-7 h-7 transition-transform duration-300" :class="isFavorite ? 'scale-110' : ''" />
						</button>
					</div>

					<!-- Trust Badges -->
					<div class="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
						<div class="flex flex-col items-center justify-center text-center gap-2">
							<div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
								<Icon name="mdi:truck-fast" class="w-5 h-5" />
							</div>
							<span class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50">Fast Delivery</span>
						</div>
						<div class="flex flex-col items-center justify-center text-center gap-2">
							<div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
								<Icon name="mdi:shield-check" class="w-5 h-5" />
							</div>
							<span class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50">Secure Pay</span>
						</div>
						<div class="flex flex-col items-center justify-center text-center gap-2">
							<div class="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
								<Icon name="mdi:refresh" class="w-5 h-5" />
							</div>
							<span class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50">Easy Returns</span>
						</div>
					</div>

				</div>
			</div>

			<!-- Feedback & Reviews Section -->
			<div v-if="product" class="mt-12 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem] p-6 lg:p-12">
				<h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 tracking-tight mb-6">
					Customer Feedback & Reviews
				</h3>
				<div class="flex items-center gap-4 mb-8">
					<div class="flex items-center text-amber-500 gap-0.5">
						<Icon v-for="star in 5" :key="star" :name="star <= (product.average_rating || 0) ? 'mdi:star' : 'mdi:star-outline'" class="w-6 h-6" />
					</div>
					<span class="text-lg font-bold text-text">{{ (product.average_rating || 0).toFixed(1) }} out of 5.0</span>
					<span class="text-text opacity-50 text-sm font-semibold">({{ product.reviews_count || 0 }} reviews)</span>
				</div>

				<div v-if="!product.reviews || product.reviews.length === 0" class="text-center py-10 bg-secondary/20 rounded-[2rem] border border-border/50">
					<Icon name="mdi:comment-text-outline" class="w-12 h-12 text-text opacity-30 mb-3" />
					<p class="text-text opacity-50 text-sm font-semibold">No reviews yet. Be the first to share your thoughts!</p>
				</div>
			</div>

			<!-- Related Products Section -->
			<div v-if="product && product.related_products && product.related_products.length > 0" class="mt-12">
				<h3 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 tracking-tight mb-8">
					Related Products You May Like
				</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					<div
						v-for="rel in product.related_products"
						:key="rel.id"
						@click="navigateToProduct(rel.id)"
						class="group bg-card/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
					>
						<div>
							<div class="aspect-square w-full bg-secondary/50 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center border border-border/50">
								<img
									v-if="rel.image || rel.image_url"
									:src="rel.image || rel.image_url"
									:alt="rel.name"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<Icon v-else name="mdi:package-variant-closed" class="w-16 h-16 text-text opacity-25" />
							</div>
							<h4 class="font-bold text-lg text-text group-hover:text-primary transition-colors line-clamp-1 leading-snug">
								{{ rel.name }}
							</h4>
						</div>
						<div class="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
							<span class="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 text-lg">
								₹{{ rel.price?.toLocaleString('en-IN') }}
							</span>
							<span class="text-xs font-bold text-primary flex items-center gap-1">
								View Details <Icon name="mdi:arrow-right" class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useProducts } from '~/composables/useProducts'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()

const productId = route.params.product_id as string

const product = ref<any>(null)
const loading = ref(true)
const error = ref<any>(null)
const addingToCart = ref(false)
const isFavorite = ref(false)
const selectedImageIndex = ref(0)

const { addToCart } = useCart()
const { fetchProductDetails } = useProducts()
const authStore = useAuthStore()

const mainImage = computed(() => {
	if (!product.value?.images?.length) return null
	return product.value.images[selectedImageIndex.value]
})

const fetchProduct = async () => {
	loading.value = true
	error.value = null

	try {
		const response: any = await fetchProductDetails(productId)
		product.value = response.data || response
	} catch (err: any) {
		console.error('Failed to load product:', err)
		error.value = err.status === 404 ? 'Product not found' : 'Failed to load product details'
	} finally {
		loading.value = false
	}
}

watch(
	() => route.params.product_id,
	(newId, oldId) => {
		if (newId === oldId) return
		fetchProduct()
	},
	{ immediate: true },
)

useSeoMeta({
	title: computed(() => product.value ? `${product.value.product_name || product.value.name} | D-Shop` : 'Product Details | D-Shop'),
	description: computed(() => product.value?.description || 'View details for this premium handcrafted product at D-Shop.'),
	ogTitle: computed(() => product.value ? `${product.value.product_name || product.value.name} | D-Shop` : 'Product Details | D-Shop'),
	ogDescription: computed(() => product.value?.description || 'View details for this premium handcrafted product at D-Shop.'),
	ogImage: computed(() => {
		if (product.value?.images && product.value.images.length > 0) {
			return product.value.images[0].url || product.value.images[0].image_url
		}
		return ''
	}),
	twitterCard: 'summary_large_image',
})

const goBack = () => {
	router.back() 
}

const handleAddToCart = async () => {
	if (!product.value || !product.value.in_stock) return

	if (!authStore.isAuthenticated) {
		router.push('/login')
		return
	}

	addingToCart.value = true
	try {
		await addToCart(productId, 1)
	} catch (err) {
		console.error('Add to cart failed:', err)
	} finally {
		addingToCart.value = false
	}
}

const toggleFavorite = () => {
	isFavorite.value = !isFavorite.value
}

const navigateToProduct = (id: string | number) => {
	router.push(`/products/${id}`)
}
</script>

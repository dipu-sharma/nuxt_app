<template>
	<div class="px-8 lg:px-6 md:px-6 sm:px-8">
		<!-- Back Button -->
		<button
			@click="goBack"
			class="mb-8 mt-4 flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group font-medium"
		>
			<svg
				class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Products
		</button>

		<!-- Loading -->
		<div v-if="loading" class="flex flex-col items-center justify-center py-32">
			<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
			<p class="mt-6 text-lg text-gray-600 font-medium">Loading product details...</p>
		</div>

		<!-- Error -->
		<div v-else-if="error" class="text-center py-32">
			<h2 class="text-3xl font-bold text-red-600 mb-4">Something went wrong</h2>
			<p class="text-lg text-gray-700 mb-8">{{ error }}</p>
			<button
				@click="fetchProduct"
				class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
			>
				Try Again
			</button>
		</div>

		<!-- Product Content -->
		<div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Images Section -->
			<div class="space-y-6">
				<div class="overflow-hidden rounded-2xl shadow-2xl bg-gray-100 relative">
					<img
						:src="mainImage || 'https://via.placeholder.com/800x800?text=No+Image+Available'"
						:alt="product.name || 'Product image'"
						class="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
					/>
					<div
						v-if="!product.in_stock"
						class="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
					>
						Out of Stock
					</div>
				</div>

				<!-- Thumbnails -->
				<div v-if="product.images?.length > 1" class="grid grid-cols-5 sm:grid-cols-6 gap-3">
					<div
						v-for="(img, index) in product.images"
						:key="index"
						class="cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
						:class="{
							'border-blue-600 ring-2 ring-blue-200': selectedImageIndex === index,
							'border-gray-200 hover:border-gray-400': selectedImageIndex !== index,
						}"
						@click="selectedImageIndex = index"
					>
						<img
							:src="img"
							:alt="`${product.name} view ${index + 1}`"
							class="w-full h-20 object-cover"
						/>
					</div>
				</div>
			</div>

			<!-- Info Section -->
			<div class="space-y-8 mx-4">
				<div>
					<span
						class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium uppercase rounded-full tracking-wide"
					>
						{{ product.category || 'Uncategorized' }}
					</span>
					<h1 class="text-3xl md:text-4xl font-bold mt-3 leading-tight">
						{{ product.name }}
					</h1>
				</div>

				<div class="flex items-end gap-4">
					<span class="text-5xl font-extrabold text-blue-700">
						₹{{ product.price?.toFixed(2) || '0.00' }}
					</span>
				</div>

				<!-- Stock & SKU -->
				<div class="flex flex-wrap gap-6 text-gray-700">
					<div>
						<span class="font-semibold">Availability:</span>
						<span
							:class="product.in_stock ? 'text-green-600' : 'text-red-600'"
							class="ml-2 font-medium"
						>
							{{ product.in_stock ? 'In Stock' : 'Out of Stock' }}
						</span>
					</div>
					<div v-if="product.sku">
						<span class="font-semibold">SKU:</span>
						<span class="ml-2">{{ product.sku }}</span>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex flex-col sm:flex-row gap-4 pt-6">
					<button
						@click="handleAddToCart"
						:disabled="addingToCart || !product.in_stock"
						class="flex-1 bg-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400 shadow-md"
					>
						{{ addingToCart ? 'Adding...' : product.in_stock ? 'Add to Cart' : 'Out of Stock' }}
					</button>

					<button
						@click="toggleFavorite"
						class="p-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
						:class="{ 'text-red-500 bg-red-50 border-red-200': isFavorite }"
					>
						<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>

				<!-- Description -->
				<div class="pt-8 border-t border-gray-200">
					<h3 class="text-xl font-semibold mb-4">Product Description</h3>
					<p class="text-gray-700 leading-relaxed whitespace-pre-line">
						{{ product.description || 'No description available for this product.' }}
					</p>
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

const product = ref(null)
const loading = ref(true)
const error = ref(null)
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
		const response = await fetchProductDetails(productId)
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
</script>

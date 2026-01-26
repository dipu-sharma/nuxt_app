<template>
	<div>
		<div class="px-8 lg:px-6 md:px-6 sm:px-8">
			<h2 class="text-2xl font-bold text-center my-8">New Product Card Design</h2>
			<section
				class="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 mt-10 mb-5"
			>
				<!-- New Product Cards -->
				<div
					class="group relative overflow-hidden rounded-lg shadow-lg"
					v-for="product in products"
					:key="product.id"
				>
					<img
						:src="product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/300x200?text=No+Image'"
						:alt="product.product_name"
						class="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-110"
					/>
					<div @click="getDetails(product.product_id)"
						class="absolute inset-x-0 bottom-0 bg-black/70 p-4 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"
					>
						<h3 class="text-lg font-bold text-white">{{ product.product_name }}</h3>
						<p class="text-sm text-gray-300">{{ product.brand_name }}</p>
						<div class="mt-4 flex items-center justify-between">
							<p class="text-lg font-bold text-white">${{ product.selling_price }}</p>
							<div class="flex items-center space-x-2">
								<button
									class="text-white hover:text-red-500 transition-colors"
									aria-label="Add to favorites"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
										/>
									</svg>
								</button>
								<button
									class="bg-blue-500 text-white py-2 px-4 rounded-full font-bold hover:bg-blue-600"
									@click="handleAddToCart(product.product_id)"
								>
									Add to Cart
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<hr class="my-8" />

			<h2 class="text-2xl font-bold text-center my-8">Original Product Card Design</h2>

			<section
				class="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 mt-10 mb-5"
			>
				<!-- Product Cards -->
				<div
					class="max-h-md bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
					v-for="product in products"
					:key="product.id"
				>
					<div @click="getDetails(product.product_id)" class="text-center items-center mx-12">
						<img :src="product.images && product.images.length > 0 ? product.images[0].image_url : 'https://via.placeholder.com/300x200?text=No+Image'" alt="Product" class="w-full h-72 object-cover rounded-t-xl" />
						<div class="p-4">
							<span class="text-gray-400 uppercase text-xs">{{ product.brand_name }}</span>
							<p class="text-lg font-bold text-black truncate capitalize">{{ product.product_name }}</p>
							<div class="flex items-center mt-2">
								<p class="text-lg font-semibold text-black">${{ product.selling_price }}</p>
								<del class="ml-2 text-sm text-gray-600">${{ product.product_mrp }}</del>
								<button
									class="ml-auto bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
									@click="handleAddToCart(product.product_id)"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										fill="currentColor"
										class="bi bi-bag-plus"
									>
										<path
											fill-rule="evenodd"
											d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
										/>
										<path
											d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue'
const router = useRouter()
const { add_to_cart } = cartApi()

const props = defineProps({
	products: {
		type: Array,
		required: false,
		default: () => [],
	},
})

const handleAddToCart = async (product_id) => {
	try {
		const items = [{ product_id: product_id, quantity: 1 }]
		await add_to_cart(items)
	} catch (error) {
		console.error('Failed to add product to cart:', error)
	}
}

const getDetails = (product_id) => {
	console.log('Navigate to product details page', product_id)
	router.push(`/products/${product_id}`)
}
</script>

<style scoped></style>

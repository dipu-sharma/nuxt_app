<template>
	<div class="px-8 lg:px-6 md:px-6 sm:px-8">
		<section
			class="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 mt-10 mb-5"
		>
			<!-- Product Cards -->
			<div
				class="max-h-md bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
				v-for="product in products"
				:key="product.id"
			>
				<a href="#" class="text-center items-center mx-12">
					<img :src="product.image" alt="Product" class="w-full h-72 object-cover rounded-t-xl" />
					<div class="p-4">
						<span class="text-gray-400 uppercase text-xs">{{ product.brand }}</span>
						<p class="text-lg font-bold text-black truncate capitalize">{{ product.name }}</p>
						<div class="flex items-center mt-2">
							<p class="text-lg font-semibold text-black">${{ product.price }}</p>
							<del class="ml-2 text-sm text-gray-600">${{ product.discount }}</del>
							<button class="ml-auto bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
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
				</a>
			</div>
		</section>
	</div>
</template>

<script setup>
const products = ref([
	{
		id: 1,
		name: 'Product 1',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 2,
		name: 'Product 2',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 3,
		name: 'Product 3',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 4,
		name: 'Product 4',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 5,
		name: 'Product 5',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 6,
		name: 'Product 6',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 7,
		name: 'Product 7',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 8,
		name: 'Product 8',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
	{
		id: 9,
		name: 'Product 9',
		price: 149,
		discount: 199,
		image: 'https://images.unsplash.com/photo-1649261191606-cb2496e97eee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
		brand: 'Brand',
	},
])
</script>

<style scoped></style>

<template>
	<div class="grid lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-6 gap-2">
		<!-- Left Column -->
		<div class="lg:col-span-2 md:col-span-3 sm:col-span-6 px-4 py-4 text-center">
			<h1 class="text-lg font-semibold">All Category</h1>
			<hr class="my-2" />

			<!-- Category Dropdown -->
			<div class="py-2 px-6 w-full">
				<select class="w-full py-2 focus:outline-none border-2 text-center border-gray-300 rounded-lg">
					<option v-for="item in items" :key="item.id" :value="item.id">
						{{ item.name }}
					</option>
				</select>
			</div>

			<!-- Range Slider -->
			<div class="py-2 px-6 w-full">
				<v-range-slider
					v-model="amount_range"
					:min="10"
					step="5"
					max="10000"
					thumb-label="always"
					color="blue"
					track-color="gray"
					track-fill-color="white"
				></v-range-slider>
			</div>
		</div>

		<!-- Right Column -->
		<div class="lg:col-span-10 md:col-span-5 sm:col-span-6">
			<Product />
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Login',
	description: 'Learn more about our company',
	layout: 'default',
})

const amount_range = ref([10, 500])
const items = ref([
	{ name: 'Category 1', id: '1' },
	{ name: 'Category 2', id: '2' },
	{ name: 'Category 3', id: '3' },
	{ name: 'Category 4', id: '4' },
])
</script>

<style scoped></style>

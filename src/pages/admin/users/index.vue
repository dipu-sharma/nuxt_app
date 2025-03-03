<template>
	<div>
		<h2 class="text-center font-bold pt-5">All Users</h2>
		<button
			@click="toggleFilter"
			class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
		>
			{{ isOpen ? 'Close Filter' : 'Open Filter' }}
		</button>
		<button
			@click="toggleNewFilter"
			class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
		>
			{{ isNewOpen ? 'Close Filter' : 'Open Filter' }}
		</button>
		<AdminPageFilter :isOpen="isOpen" @updateFilters="handleFilterUpdate" />
		<AdminPageFilterTabFilter :isOpen="isNewOpen" @updateFilters="handleFilterUpdate" />
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['admin'],
})

const isOpen = ref(false)
const isNewOpen = ref(false)
const selectedFilters = ref({
	startDate: null,
	endDate: null,
	selectedOptions: [],
})

const toggleFilter = () => {
	isOpen.value = !isOpen.value
}
const toggleNewFilter = () => {
	isNewOpen.value = !isNewOpen.value
}

const handleFilterUpdate = (filters) => {
	selectedFilters.value = filters
}
</script>

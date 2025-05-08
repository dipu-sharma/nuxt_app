<template>
	<div class="w-full">
		<!-- Search Bar -->
		{{ darkMode }}
		<div class="flex gap-6 justify-between mb-6">
			<p class="text-2xl font-bold"></p>
			<input
				v-model="search"
				type="text"
				placeholder="Single Search"
				class="w-64 border-2 border-gray-300 dark:text-white light:text-black rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
			/>
		</div>

		<!-- Data Table -->
		<v-data-table
			:headers="headers"
			:items="items"
			:page.sync="internalPage"
			:items-per-page.sync="internalItemsPerPage"
			:server-items-length="item_total"
			item-value="id"
			:loading="loading"
			class="!rounded-lg"
			v-model:search="search"
			:header-props="{ class: 'bg-[#FBAB33] table-header text-white !font-semibold' }"
		>
			<!-- Custom Header for Stock -->
			<template v-slot:header.stock>
				<div class="text-end">Stock</div>
			</template>

			<!-- Custom Item Template for Image -->
			<template v-slot:item.image="{ item }">
				<v-card class="my-2" elevation="2" rounded>
					<v-img
						:src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`"
						height="64"
						cover
					></v-img>
				</v-card>
			</template>

			<!-- Custom Item Template for Actions -->
			<template v-slot:item.actions="{ item }">
				<div class="flex justify-between gap-2">
					<button
						icon
						@click="editItem(item)"
						class="bg-orange-500 rounded-full p-3 hover:bg-green-500 shadow-lg"
					>
						<v-icon>mdi-pencil</v-icon>
					</button>
					<button
						icon
						@click="deleteItem(item)"
						class="bg-red-700 rounded-full p-3 hover:bg-green-500 shadow-lg"
					>
						<v-icon>mdi-delete</v-icon>
					</button>
				</div>
			</template>
		</v-data-table>

		<!-- Pagination Control -->
		<v-pagination v-model="internalPage" :length="totalPages" :total-visible="5"></v-pagination>
	</div>
</template>

<script setup>
import { useThemeStore } from '~/stores/themeStore'
const ThemeStore = useThemeStore()
const darkMode = ThemeStore.theme
const props = defineProps({
	headers: { type: Array, required: true },
	items: { type: Array, required: true },
	page: { type: Number, required: true },
	itemsPerPage: { type: Number, required: true },
	item_total: { type: Number, required: true },
	loading: { type: Boolean, default: false },
})
const emit = defineEmits(['page_change', 'item_per_page', 'reload:table', 'update', 'delete'])
const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)

const search = ref('')

watch(internalPage, (newPage) => {
	emit('page_change', newPage)
})

watch(internalItemsPerPage, (newItemsPerPage) => {
	emit('item_per_page', newItemsPerPage)
})

const editItem = (item = {}) => {
	emit('update', item)
}

const deleteItem = (item) => {
	emit('delete', item)
}

const totalPages = computed(() => Math.ceil(props.item_total / internalItemsPerPage.value))
</script>

<style scoped></style>

<!-- components/DataTable.vue -->
<template>
	<div class="w-full">
		<!-- Search Bar -->
		<div class="flex gap-6 justify-between">
			<p class="text-2xl font-bold">Table</p>
			<input
				v-model="search"
				type="text"
				placeholder="Single Search"
				class="w-64 border-2 border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
			/>
		</div>

		<!-- Data Table -->
		<v-data-table
			:headers="headers"
			:items="items"
			:page.sync="internalPage"
			:items-per-page.sync="internalItemsPerPage"
			:server-items-length="totalItems"
			item-value="id"
			:loading="loading"
			v-model:search="search"
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
					<v-btn icon @click="editItem(item)">
						<v-icon>mdi-pencil</v-icon>
					</v-btn>
					<v-btn icon @click="deleteItem(item)">
						<v-icon>mdi-delete</v-icon>
					</v-btn>
				</div>
			</template>
		</v-data-table>

		<!-- Pagination Control -->
		<v-pagination v-model="internalPage" :length="totalPages" :total-visible="5"></v-pagination>
	</div>

	<Dialog
		v-model="showEditProductDialog"
		:model-value="showEditProductDialog"
		title="Edit Product"
		button_text="Update"
		@cancel="closeModal"
		@submit="updateProduct"
	>
		<template #content>
			<v-form ref="productForm" v-model="isValid">
				{{ editData }}
				<!-- <v-text-field v-model="productData.name" label="Product Name" outlined></v-text-field>
                <v-text-field v-model="productData.price" label="Price" type="number" outlined></v-text-field>
                <v-text-field v-model="productData.quantity" label="Quantity" type="number" outlined></v-text-field> -->
			</v-form>
		</template>
	</Dialog>
</template>

<script setup>
const props = defineProps({
	headers: { type: Array, required: true },
	items: { type: Array, required: true },
	page: { type: Number, required: true },
	itemsPerPage: { type: Number, required: true },
	totalItems: { type: Number, required: true },
	loading: { type: Boolean, default: false },
})
const productData = ref({
	name: '',
	price: '',
	quantity: '',
})
const isValid = ref('')
const editData = ref({})
const emit = defineEmits(['update:page', 'update:itemsPerPage', 'reload:table'])
const showEditProductDialog = ref(false)
const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)
const updateProduct = (data) => {
	console.log('Updated__________________________', data)
}
const search = ref('')

watch(internalPage, (newPage) => {
	emit('update:page', newPage)
})

watch(internalItemsPerPage, (newItemsPerPage) => {
	emit('update:itemsPerPage', newItemsPerPage)
})

const totalPages = computed(() => Math.ceil(props.totalItems / internalItemsPerPage.value))

const editItem = (item) => {
	showEditProductDialog.value = true
	editData.value = item
	console.log('Edit item:', item)
}

const deleteItem = (item) => {
	console.log('Delete item:', item)
}

const closeModal = () => {
	showEditProductDialog.value = false
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>

<template>
	<div class="p-6">
		<section class="mb-4 flex gap-4 justify-end items-center">
			<div class="flex gap-4 items-center">
				<button
					type="button"
					@click="handleAddStockItem"
					class="light:text-black text-center rounded-lg transition"
					alt="Add Stock Item"
					title="Add Stock Item"
				>
					<Icon name="mdi-plus" class="" width="50" height="50" />
				</button>
				<button
					type="button"
					@click="exportToExcel"
					class="light:text-black text-center rounded-lg transition"
					alt="Export to Excel"
					title="Export to Excel"
				>
					<Icon name="mdi-cloud-download" width="50" height="50" />
				</button>
			</div>
		</section>

		<!-- Inventory Table Component -->
		<TablesTable2
			:headers="data_table?.headers"
			:items="data_table?.items"
			:page="currentPage"
			:itemsPerPage="itemsPerPage"
			:item_total="data_table.total_data"
			:loading="isLoading"
			@update="handleEdit"
			@search="handleSearchInventory"
			@delete="handleDelete"
			@page_change="handlePageChange"
			@item_per_page="handleItemsPerPageChange"
		/>
	</div>
	<Dialog
		v-model="is_modal_visible"
		:loading="isLoading"
		title="Add Stock Item"
		:button-text="isEdit ? 'Update' : 'Save'"
		max-width="1000px"
		@confirm="handleSaveStockItem"
	>
		<template #content>
			<FormsStockItem />
		</template>
	</Dialog>
</template>
<script setup>
definePageMeta({
	title: 'Inventory',
	middleware: 'auth-role',
	layout: 'admin',
})

const data_table = ref({
	items: [],
	total_data: 0,
	total_pages: 0,
	headers: [
		{ title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
		{ title: 'Item Name', value: 'item_name' },
		{ title: 'Batch No', value: 'batch_no' },
		{ title: 'Supplier Name', value: 'supplier_name' },
		{ title: 'Quantity', value: 'quantity' },
		{ title: 'Expiry Date', value: 'expiry_date' },
		{ title: 'Unit Price', value: 'unit_price' },
		{ title: 'Net Rate', value: 'net_rate' },
		{ title: 'Actions', value: 'actions', sortable: false },
	],
})

const currentPage = ref(1)
const itemsPerPage = ref(10)
const is_modal_visible = ref(false)
const isLoading = ref(false)

const handlePageChange = (page) => {
	currentPage.value = page
}

const handleItemsPerPageChange = (items) => {
	itemsPerPage.value = items
	currentPage.value = 1
}

const handleAddStockItem = () => {
	is_modal_visible.value = true
	console.log('handleAddStockItem function is not yet defined')
}

const exportToExcel = () => {
	console.log('exportToExcel function is not yet defined')
}

const handleEdit = (item) => {
	console.log('handleEdit function is not yet defined', item)
}

const handleSearchInventory = (query) => {
	console.log('handleSearchInventory function is not yet defined', query)
}

const handleDelete = (item) => {
	console.log('handleDelete function is not yet defined', item)
}

const handleSaveStockItem = () => {
	console.log('handleSaveStockItem function is not yet defined')
}
</script>
<style scoped></style>

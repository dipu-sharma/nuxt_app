<template>
	<div class="p-6">
		<section class="mb-4 flex gap-4 justify-between items-center">
			<h1 class="text-2xl font-bold">Inventory Management</h1>
			<div class="flex gap-4 items-center">
				<button
					type="button"
					@click="filterStore.toggleFilterSidebar()"
					class="light:text-black text-center rounded-lg transition"
					alt="Filter"
					title="Filter"
				>
					<Icon name="mdi:filter" class="" width="50" height="50" />
				</button>
				<button
					type="button"
					@click="openAddItemModal"
					class="light:text-black text-center rounded-lg transition"
					:alt="selectedTab === 'stock' ? 'Add Stock Item' : 'Add Purchase Order'"
					:title="selectedTab === 'stock' ? 'Add Stock Item' : 'Add Purchase Order'"
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

		<v-tabs v-model="selectedTab" background-color="transparent" color="primary" grow>
			<v-tab value="stock">Stock</v-tab>
			<v-tab value="purchase-orders">Purchase Orders</v-tab>
		</v-tabs>

		<v-window v-model="selectedTab">
			<v-window-item value="stock">
				<TablesTable2
					:headers="stock_table?.headers"
					:items="items"
					:page="currentPage"
					:itemsPerPage="itemsPerPage"
					:item_total="total_data"
					:loading="isLoading"
					@update="handleEdit"
					@search="handleSearch"
					@delete="handleDelete"
					@page_change="handlePageChange"
					@item_per_page="handleItemsPerPageChange"
				/>
			</v-window-item>
			<v-window-item value="purchase-orders">
				<BusinessPurchaseOrderTable />
			</v-window-item>
		</v-window>
	</div>

	<Dialog
		v-model="is_modal_visible"
		:loading="isLoading"
		:title="selectedTab === 'stock' ? 'Add Stock Item' : 'Add Purchase Order'"
		:button-text="isEdit ? 'Update' : 'Save'"
		max-width="1000px"
		@confirm="handleSaveItem"
	>
		<template #content>
			<FormsStockItem v-if="selectedTab === 'stock'" ref="formComponent" />
			<FormsPurchaseOrder v-else ref="formComponent" />
		</template>
	</Dialog>
</template>
<script setup>
import { ref } from 'vue'
import purchaseOrderApi from '~/api/purchaseOrderApi'
import { useFilterStore } from '~/stores/filterStore'
import { toast } from 'vue3-toastify'
import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { useDataTable } from '~/composables/useDataTable'
import productApi from '~/api/productApi'

const { createPurchaseOrder } = purchaseOrderApi()
const { get_business_product_list } = productApi()
const filterStore = useFilterStore()

definePageMeta({
	middleware: 'auth-role',
	layout: 'admin',
})

const {
    items,
    isLoading,
    currentPage,
    itemsPerPage,
    total_data,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
} = useDataTable({
    apiFetchFunction: get_business_product_list,
});

const selectedTab = ref('stock')
const formComponent = ref(null)

const stock_table = ref({
	headers: [
		{ title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
		{ title: 'Item Name', value: 'product_name' },
		{ title: 'Batch No', value: 'batch_no' },
		{ title: 'Supplier Name', value: 'supplier_name' },
		{ title: 'Quantity', value: 'product_qty' },
		{ title: 'Expiry Date', value: 'exp_date' },
		{ title: 'Unit Price', value: 'selling_price' },
		{ title: 'Net Rate', value: 'net_rate' },
		{ title: 'Actions', value: 'actions', sortable: false },
	],
})

const is_modal_visible = ref(false)
const isEdit = ref(false)

const openAddItemModal = () => {
	is_modal_visible.value = true
	isEdit.value = false
}

const exportToExcel = () => {
	console.log('exportToExcel function is not yet defined')
}

const handleEdit = (item) => {
	is_modal_visible.value = true
	isEdit.value = true
	console.log('handleEdit function is not yet defined', item)
}

const handleDelete = (item) => {
	console.log('handleDelete function is not yet defined', item)
}

const handleSaveItem = async () => {
	if (formComponent.value) {
		const formData = await formComponent.value.submit()
		if (formData) {
			isLoading.value = true
			try {
				if (selectedTab.value === 'purchase-orders') {
					await createPurchaseOrder(formData)
					toast.success('Purchase order created successfully')
				} else {
					console.log('handleSaveStockItem function is not yet defined')
					toast.info('Stock item functionality is not yet implemented')
				}
				is_modal_visible.value = false
			} catch (error) {
				const { data } = error.response
				handleAxiosError(data.status_code, data.message, toast)
			} finally {
				isLoading.value = false
			}
		}
	}
}
</script>
<style scoped></style>

<template>
	<div class="p-6">
		<section class="mb-4 flex gap-4 justify-end items-center">
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
					@click="handleAddProduct"
					class="light:text-black text-center rounded-lg transition"
					alt="Add Product"
					title="Add Product"
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

		<TablesTable2
			:headers="data_table?.headers"
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
	</div>

	<Dialog
		v-model="isAddProductDialogVisible"
		:loading="isLoading"
		title="Add Product"
		:button-text="isEdit ? 'Update' : 'Save'"
		max-width="1000px"
		@confirm="handleSaveProduct"
	>
		<template #content>
			<FormsProduct :modelValue="payload" />
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/projects'
import { useAuthStore } from '~/stores/auth'
import { useProducts } from '~/composables/useProducts'
import { toast } from 'vue3-toastify'
import { useDataTable } from '~/composables/useDataTable'

const AuthStore = useAuthStore()
const { fetchBusinessProducts, createProduct, updateProduct, deleteProduct } = useProducts()

const filterStore = useFilterStore();

// Page metadata
definePageMeta({
	title: 'Products',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const {
    items,
    isLoading,
    currentPage,
    itemsPerPage,
    total_data,
    fetchData,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
} = useDataTable({
    apiFetchFunction: fetchBusinessProducts,
});


// Constants
const FILE_TYPE_SPECS = {
	excel: { extensions: ['xls', 'xlsx'], maxSizeMB: 5 },
	image: { extensions: ['png', 'jpeg', 'jpg'], maxSizeMB: 5 },
	pdf: { extensions: ['pdf'], maxSizeMB: 5 },
}

// Refs
const isAddProductDialogVisible = ref(false)
const projectStore = useProjectStore()
const isEdit = ref(false)
const data_table = ref({
	headers: [
		{ title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
		{ title: 'Product Name', value: 'product_name', sortable: false, align: 'left' },
		{ title: 'Product Type', value: 'product_type', sortable: false, align: 'left' },
		{ title: 'Batch No', value: 'batch_no', sortable: false, align: 'left' },
		{ title: 'Quantity', value: 'product_qty', sortable: false, align: 'left' },
		{ title: 'Unit', value: 'product_unit', sortable: false, align: 'left' },
		{ title: 'MRP', value: 'product_mrp', sortable: false, align: 'left' },
		{ title: 'Selling Price', value: 'selling_price', sortable: false, align: 'center', width: '200px' },
		{ title: 'Size', value: 'size', sortable: false, align: 'left', width: '120px' },
		{ title: 'Color', value: 'color', sortable: false, align: 'left', width: '100px' },
		{ title: 'HSN', value: 'hsn_no', sortable: false, align: 'left' },
		{ title: 'Discount', value: 'discount_percent', sortable: false, align: 'left' },
		{ title: 'Packing', value: 'product_packing', sortable: false, align: 'left' },
		{ title: '', value: 'actions', sortable: false, align: 'left' },
	],
})

// Form data
const payload = ref({
	product_name: null,
	brand_name: null,
	product_tax: 0.0,
	description: null,
	product_sku: null,
	product_cost_price: 0.0,
	product_mrp: null,
	selling_price: null,
	discount_percent: 0.0,
	product_qty: 0.0,
	product_packing: null,
	hsn_no: null,
	mfg_date: null,
	exp_date: null,
	batch_no: null,
	size: null,
	color: null,
	product_unit: 'PCS',
	product_type: 'FASHION',
})

// File upload related refs
const uploadedFiles = ref([])
const pdfPreviewUrl = ref('')
const errorMessage = ref('')

// Methods
const showAddProductDialog = () => {
	isAddProductDialogVisible.value = true
}

const handleSaveProduct = async () => {
	isLoading.value = true
	try {
		let response;
		if (isEdit.value) {
			response = await updateProduct(payload.value?.product_id, payload.value)
			if (response.status_code === 200) {
				toast.success(response?.message || 'Product updated successfully')
			}
		} else {
			response = await createProduct(payload.value)
			if (response.status_code === 200) {
				toast.success(response?.message || 'Product created successfully')
			}
		}
		isAddProductDialogVisible.value = false
		await fetchData()
	} catch (error) {
		toast.error('Failed to save product')
	} finally {
		isLoading.value = false
		isAddProductDialogVisible.value = false
	}
}

const handleFileUpload = (payload) => {
	if (!payload?.file) {
		console.error('Invalid file upload payload:', payload)
		return
	}

	if (payload.type === 'pdf') {
		pdfPreviewUrl.value = URL.createObjectURL(payload.file)
	}

	// Add additional file handling logic here
}

const handleFilesUpload = (payload) => {
	uploadedFiles.value = payload.files || []
	errorMessage.value = uploadedFiles.value.length ? '' : 'No files uploaded'
}

const removeUploadedFile = (index) => {
	uploadedFiles.value.splice(index, 1)
}

const exportToExcel = () => {
	const { convertToExcel } = useExcel()

	convertToExcel(
		[
			{
				'Sr No.': '',
				'Product Name': '',
				'Product Type': '',
				'Batch No': '',
				Quantity: '',
				Unit: '',
				MRP: '',
				'Selling Price': '',
				Size: '',
				Color: '',
				HSN: '',
				Discount: '',
				Packing: '',
			},
		],
		false,
		'product_data.xlsx',
	)
}

const handleAddProduct = () => {
	isEdit.value = false
	isAddProductDialogVisible.value = true
	payload.value = {
		product_name: null,
		brand_name: null,
		product_tax: 0.0,
		description: null,
		product_sku: null,
		product_cost_price: 0.0,
		product_mrp: null,
		selling_price: null,
		discount_percent: 0.0,
		product_qty: 0.0,
		product_packing: null,
		hsn_no: null,
		mfg_date: null,
		exp_date: null,
		batch_no: null,
		size: null,
		color: null,
		product_unit: 'PCS',
		product_type: 'FASHION',
	}
}

const handleEdit = (item) => {
	console.log('Edit in parent____________________', item)
	isEdit.value = true
	isAddProductDialogVisible.value = true
	payload.value = {
		...item,
		product_mrp: item.product_mrp || 0.0,
		selling_price: item.selling_price || 0.0,
		product_cost_price: item.product_cost_price || 0.0,
		product_qty: item.product_qty || 0.0,
		product_tax: item.product_tax || 0.0,
	}
	payload.value.product_unit = item.product_unit || 'PCS'
}

const handleDelete = (item) => {
	console.log('Delete in parent____________________', item)
}


// Watch for changes in store
watch(
	() => projectStore.save_for_planning,
	(newVal, oldVal) => {
		console.log('Save for Planning changed from', oldVal, 'to', newVal)
	},
)
</script>

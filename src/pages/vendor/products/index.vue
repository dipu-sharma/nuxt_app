<template>
	<div class="container mx-auto p-5">
		<section class="mb-4">
			<button
				type="button"
				@click="showAddProductDialog"
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
			>
				Add Product
			</button>
		</section>

		<TablesTable2
			:headers="data_table?.headers"
			:items="data_table?.items"
			:page="currentPage"
			:itemsPerPage="itemsPerPage"
			:item_total="data_table.total_data"
			:loading="isLoading"
			@update="handleEdit"
			@delete="handleDelete"
			@page_change="handlePageChange"
			@item_per_page="handleItemsPerPageChange"
		/>
	</div>

	<Dialog
		v-model="isAddProductDialogVisible"
		title="Add Product"
		button-text="Save"
		max-width="1000px"
		@confirm="handleSaveProduct"
	>
		<template #content>
			<FormsProduct :payload="productPayload" />
		</template>
	</Dialog>
</template>

<script setup>
import { useProjectStore } from '~/stores/projects'
import { useAuthStore } from '~/stores/auth'
const AuthStore = useAuthStore()
import * as XLSX from 'xlsx'
import { toast } from 'vue3-toastify'

// Page metadata
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['VENDOR'],
})

// Constants
const FILE_TYPE_SPECS = {
	excel: { extensions: ['xls', 'xlsx'], maxSizeMB: 5 },
	image: { extensions: ['png', 'jpeg', 'jpg'], maxSizeMB: 5 },
	pdf: { extensions: ['pdf'], maxSizeMB: 5 },
}

// Refs
const isAddProductDialogVisible = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const projectStore = useProjectStore()

const data_table = ref({
	items: [],
	total_data: 0,
	total_pages: 0,
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
		{ title: 'Discount', value: 'discount', sortable: false, align: 'left' },
		{ title: 'Packing', value: 'product_packing', sortable: false, align: 'left' },
		{ title: '', value: 'actions', sortable: false, align: 'left' },
	],
})

// Form data
const productPayload = ref({
	product_name: '',
	price: '',
	quantity: '',
})

// File upload related refs
const uploadedFiles = ref([])
const pdfPreviewUrl = ref('')
const errorMessage = ref('')

// Methods
const showAddProductDialog = () => {
	isAddProductDialogVisible.value = true
}

const handleSaveProduct = () => {
	// Add product save logic here
	isAddProductDialogVisible.value = false
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
	// Excel export logic would go here
	// Currently using mock data from the original code
}

const fetchData = async () => {
	isLoading.value = true
	const { get_vendor_product_list } = productApi()
	const filters = {
		page: 1,
		sort_by: '-created_at',
		per_page: 10,
		is_paginate: true,
	}
	try {
		const respnse = await get_vendor_product_list({ query: filters })
		console.log('Response___________________________', respnse)
		if (respnse?.data?.detail?.status_code === 401) {
			AuthStore.doLogout()
			navigateTo('/login')
		}
		if (respnse?.data?.detail?.status_code === 400) {
			toast.error('Data not found')
		}

		if (respnse?.status_code === 200) {
			data_table.value.items = respnse?.data?.result?.map((item, i) => ({
				...item,
				index: i + 1,
			}))

			console.log('Data Table____________________', data_table.value.items)
		}
		data_table.value.total_data = respnse?.data?.total
	} finally {
		isLoading.value = false
	}
}

const handlePageChange = (newPage) => {
	currentPage.value = newPage
	fetchData()
}

const handleEdit = (item) => {
	console.log('Edit in parent____________________', item)
}

const handleDelete = (item) => {
	console.log('Delete in parent____________________', item)
}

const handleItemsPerPageChange = (newItemsPerPage) => {
	itemsPerPage.value = newItemsPerPage
	fetchData()
}

// Watch for changes in store
watch(
	() => projectStore.save_for_planning,
	(newVal, oldVal) => {
		console.log('Save for Planning changed from', oldVal, 'to', newVal)
	},
)

onMounted(async () => {
	await fetchData()
})

onServerPrefetch(async () => {
	await fetchData()
})
</script>

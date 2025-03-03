<template>
	<div class="container mx-auto p-5">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-center pt-5">Admin Products Page</h1>
		</div>

		<!-- Planning Data Input -->
		<div class="mt-8">
			<h3 class="text-lg font-semibold mb-4">
				Save for Planning:
				<span class="font-normal">{{ projectStore.save_for_planning }}</span>
			</h3>

			<!-- Input field for planning data -->
			<input
				v-model="planningData"
				placeholder="Enter planning data"
				class="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<!-- Save Button -->
			<button
				@click="savePlanningData"
				class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-4"
			>
				Save Planning Data
			</button>

			<button
				@click="createProduct"
				class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mb-4 ml-4"
			>
				Create Product
			</button>
		</div>
		<!-- File Upload Component -->
		<div class="flex gap-4">
			<UploadFileSingleFile @file-uploaded="handleFileUpload" :details="file_type.excel_details" />
			<UploadFileSingleFile @file-uploaded="handleFileUpload" :details="file_type.image_details" />
			<UploadFileSingleFile @file-uploaded="handleFileUpload" :details="file_type.pdf_details" />
		</div>
		<!-- File Preview Section -->
		<div class="filePreview">
			<!-- Image Preview -->
			<div v-if="fileType === 'image' && previewUrl">
				<img :src="previewUrl" alt="Image Preview" />
			</div>

			<!-- PDF Preview -->
			<div v-else-if="fileType === 'pdf' && file">
				<iframe v-if="pdfviewurl" :src="pdfviewurl" width="100%" height="400px"></iframe>
				<p v-else>No PDF uploaded</p>
			</div>

			<!-- Excel Preview -->
			<div v-else-if="fileType === 'excel' && file">
				<p>Excel file uploaded: {{ file.name }}</p>
			</div>
		</div>

		<!-- Multi File Upload Component -->
		<UploadFileMultiFile @files-uploaded="handleFilesUpload" />
		<div v-for="(file, index) in files" :key="index" class="imgPreview">
			<div v-if="file.preview">
				<img :src="file.preview" />
				<button class="removeButton" @click="removeImage(index)">✖</button>
			</div>
			<div v-else class="previewText">No preview available</div>
		</div>
		<h1 class="text-center text-2xl font-bold">Selected Products</h1>
		<!-- <div class="d-flex gap-4">
      <div v-if="selectedSystems.length > 0" @click="SaveMilestone"
        class="text-white bg-gradient-to-r from-[#FF9C06] to-[#F42C00] focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 text-center cursor-pointer">
        Save
      </div>
      <div v-if="selectedSystems.length > 0" @click="exportToExcel"
        class="text-white bg-gradient-to-r from-[#FF9C06] to-[#F42C00] focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 text-center cursor-pointer">
        Download Template
      </div>
    </div> -->

		<TablesTable2
			:headers="table2_datatable.headers"
			:items="table2_datatable.items"
			:page="table2_datatable.page"
			:itemsPerPage="itemsPerPage"
			:totalItems="totalItems"
			:loading="loading"
			@update:page="updatePage"
			@update:itemsPerPage="updateItemsPerPage"
		/>
	</div>
	<Dialog
		v-model="showEditProductDialog"
		:model-value="addModal"
		title="Add Product"
		button_text="Save"
		@cancel="closeModal"
		@submit="updateProduct"
	>
		<template #content>
			<v-form ref="productForm" v-model="isValid">
				<v-text-field v-model="productData.name" label="Product Name" outlined></v-text-field>
				<v-text-field v-model="productData.price" label="Price" type="number" outlined></v-text-field>
				<v-text-field
					v-model="productData.quantity"
					label="Quantity"
					type="number"
					outlined
				></v-text-field>
			</v-form>
		</template>
	</Dialog>
</template>

<script setup>
import { useProjectStore } from '~/stores/projects'
import { multiple_items } from '~/utils/repository'
import * as XLSX from 'xlsx'

definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
})
const isValid = ref('')
const projectStore = useProjectStore()
const planningData = ref('')
const selectedSystems = ref([])
const file_type = {
	excel_details: { type: 'excel', extension: ['xls', 'xlsx'], size: 5 },
	image_details: { type: 'image', extension: ['png', 'jpeg', 'jpg'], size: 5 },
	pdf_details: { type: 'pdf', extension: ['pdf'], size: 5 },
}
const loading = ref(false)
const page = ref(0)
const items = ref([])
let totalItems = 100
const itemsPerPage = ref(10)
const addModal = ref(false)

const datatable = ref({
	total_items: [],
	multiple_items: [],
	itemsPerPageOptions: [5, 10, 50, 100, 200, -1],
	header: [
		{ title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
		{
			title: 'Milestone No',
			value: 'milestone_no',
			sortable: false,
			align: 'left',
		},
		{ title: 'Task', value: 'task', sortable: false, align: 'left' },
		{
			title: 'Description',
			value: 'description',
			sortable: false,
			align: 'left',
		},
		{ title: 'Comment', value: 'comment', sortable: false, align: 'left' },
		{ title: 'Location', value: 'location', sortable: false, align: 'left' },
		{
			title: 'Configuration',
			value: 'configuration',
			sortable: false,
			align: 'left',
		},
		{
			title: 'Start Date',
			value: 'start_date',
			sortable: false,
			align: 'center',
			width: '200px',
		},
		{
			title: 'End Date',
			value: 'end_date',
			sortable: false,
			align: 'left',
			width: '120px',
		},
		{
			title: 'Working Days',
			value: 'working_days',
			sortable: false,
			align: 'left',
			width: '100px',
		},
		{ title: 'Man Power', value: 'man_power', sortable: false, align: 'left' },
		{ title: 'Quantity', value: 'quantity', sortable: false, align: 'left' },
	],
})

const errorMessage = ref('')
const file = ref(null)
const previewUrl = ref('')
const pdfviewurl = ref('')
const fileType = ref('')
const files = ref([])

const handleFileUpload = (payload) => {
	console.log('File upload payload:', payload)
	if (!payload || !payload.file) {
		console.error('Invalid file upload payload:', payload)
		return
	}
	if (payload.file && payload.type === 'pdf') {
		pdfviewurl.value = URL.createObjectURL(payload?.file)
	}
	file.value = payload.file
	previewUrl.value = payload.previewUrl
	fileType.value = payload.type

	console.log('File:', file.value)
	console.log('Preview URL:', previewUrl.value)
	console.log('File Type:', fileType.value)
}

const handleFilesUpload = (payload) => {
	files.value = payload.files

	if (!files.value) {
		errorMessage.value = 'No image preview available.'
	} else {
		errorMessage.value = ''
	}
}
const removeImage = (index) => {
	files.value.splice(index, 1)
}
const table2_datatable = ref({
	items: [],
	loading: false,
	totalItems: 0,
	page: 1,
	itemsPerPage: 5,
	headers: [
		{ title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
		{
			title: 'Milestone No',
			value: 'milestone_no',
			sortable: false,
			align: 'left',
		},
		{ title: 'Task', value: 'task', sortable: false, align: 'left' },
		{
			title: 'Description',
			value: 'description',
			sortable: false,
			align: 'left',
		},
		{ title: 'Comment', value: 'comment', sortable: false, align: 'left' },
		{ title: 'Location', value: 'location', sortable: false, align: 'left' },
		{
			title: 'Configuration',
			value: 'configuration',
			sortable: false,
			align: 'left',
		},
		{
			title: 'Start Date',
			value: 'start_date',
			sortable: false,
			align: 'center',
			width: '200px',
		},
		{
			title: 'End Date',
			value: 'end_date',
			sortable: false,
			align: 'left',
			width: '120px',
		},
		{
			title: 'Working Days',
			value: 'working_days',
			sortable: false,
			align: 'left',
			width: '100px',
		},
		{ title: 'Man Power', value: 'man_power', sortable: false, align: 'left' },
		{ title: 'Quantity', value: 'quantity', sortable: false, align: 'left' },
		{ title: 'Stock', value: 'image', sortable: false, align: 'left' },
		{ title: '', value: 'actions', sortable: false, align: 'left' },
	],
})
const productData = ref({
	name: '',
	price: '',
	quantity: '',
})
const savePlanningData = () => {
	projectStore.SaveForPlanning(planningData.value.split(','))
}
const createProduct = () => {
	addModal.value = true
}
const closeModal = () => {
	addModal.value = false
}

datatable.value.multiple_items = multiple_items
table2_datatable.value.items = multiple_items
table2_datatable.value.totalItems = multiple_items.length

const exportToExcel = () => {
	const ws_data = selectedSystems.value.map((system, index) => ({
		'Sr No.': index + 1,
		'System Name': system[0].system_name,
		'Module No': system[0]?.module_no,
		Location: system[0]?.location,
		Task: system[0]?.task,
		'Start Date': system[0]?.start_date,
		'End Date': system[0]?.end_date,
		'Working Days': system[0]?.working_days,
		'Man Power': system[0]?.man_power,
		Quantity: system[0]?.quantity,
	}))

	// Create a worksheet
	const worksheet = XLSX.utils.json_to_sheet(ws_data)

	// Create a new workbook
	const workbook = XLSX.utils.book_new()

	// Append the worksheet to the workbook
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Systems')

	// Generate an XLSX file and trigger the download
	XLSX.writeFile(workbook, 'selected_systems.xlsx')
}
const fetchData = async () => {
	loading.value = true
	const { data, total } = await getDataFromServer(page.value, itemsPerPage.value)

	items.value = data
	totalItems = total || 100
	loading.value = false
}

const getDataFromServer = async (page, itemsPerPage) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = [
				{ id: 1, name: 'John', age: 25 },
				{ id: 2, name: 'Jane', age: 30 },
				{ id: 3, name: 'Mike', age: 28 },
				// More items...
			]
			const total = 50 // Total number of items in the server
			resolve({ data, total })
		}, 1000)
	})
}

// Methods to handle pagination changes
const updatePage = (newPage) => {
	page.value = newPage
	fetchData()
}

const updateItemsPerPage = (newItemsPerPage) => {
	itemsPerPage.value = newItemsPerPage
	fetchData() // Refetch data when items per page changes
}

fetchData()
watch(
	() => projectStore.save_for_planning,
	(newVal, oldVal) => {
		console.log('Save for Planning changed from', oldVal, 'to', newVal)
	},
)
</script>

<template>
	<div class="p-6">
		<section class="mb-4 flex gap-4 justify-between items-center">
			<h1 class="text-2xl font-bold">Sales Orders</h1>
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
			:items="data_table?.items"
			:page="currentPage"
			:itemsPerPage="itemsPerPage"
			:item_total="data_table.total_data"
			:loading="isLoading"
			@update="handleChangeStatus"
			@search="handleSearch"
			@delete="handleViewDetails"
			@page_change="handlePageChange"
			@item_per_page="handleItemsPerPageChange"
		/>
	</div>

    <Dialog
		v-model="isChangeStatusDialogVisible"
		:loading="isLoading"
		title="Change Order Status"
		button-text="Update Status"
		max-width="500px"
		@confirm="updateOrderStatus"
	>
		<template #content>
            <v-select
                label="Status"
                :items="['Pending', 'Shipped', 'Delivered', 'Cancelled']"
                v-model="selectedStatus"
            ></v-select>
		</template>
	</Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useFilterStore } from '~/stores/filterStore'
import Dialog from '~/components/Dialog/Dialog.vue'

definePageMeta({
	title: 'Sales Orders',
	description: 'Manage Sales Orders',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const filterStore = useFilterStore()

const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const isChangeStatusDialogVisible = ref(false)
const selectedStatus = ref('Pending')
const selectedOrder = ref(null)
const searchQuery = ref('')

const data_table = ref({
	headers: [
		{ title: 'Order ID', value: 'id' },
		{ title: 'Customer', value: 'customer' },
		{ title: 'Amount', value: 'amount' },
		{ title: 'Status', value: 'status' },
		{ title: 'Date', value: 'date' },
		{ title: 'Actions', value: 'actions', sortable: false }
	],
	items: [],
	total_data: 0
})

const mockOrders = ref([
	{ id: 1001, customer: 'John Doe', email: 'john@example.com', amount: '₹1,250.00', status: 'Pending', date: '2026-06-15' },
	{ id: 1002, customer: 'Alice Smith', email: 'alice@example.com', amount: '₹3,400.00', status: 'Shipped', date: '2026-06-16' },
	{ id: 1003, customer: 'Bob Johnson', email: 'bob@example.com', amount: '₹850.00', status: 'Delivered', date: '2026-06-16' },
	{ id: 1004, customer: 'Eva Green', email: 'eva@example.com', amount: '₹2,100.00', status: 'Cancelled', date: '2026-06-17' },
	{ id: 1005, customer: 'Michael Brown', email: 'michael@example.com', amount: '₹1,500.00', status: 'Pending', date: '2026-06-17' }
])

const loadOrders = () => {
	isLoading.value = true
	try {
		let filtered = [...mockOrders.value]

		// Filter by search
		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase()
			filtered = filtered.filter(o => 
				o.customer.toLowerCase().includes(query) || 
				o.id.toString().includes(query)
			)
		}

		// Filter by date range from store
		if (filterStore.startDate) {
			filtered = filtered.filter(o => new Date(o.date) >= filterStore.startDate)
		}
		if (filterStore.endDate) {
			filtered = filtered.filter(o => new Date(o.date) <= filterStore.endDate)
		}

		data_table.value.total_data = filtered.length

		// Paginate
		const start = (currentPage.value - 1) * itemsPerPage.value
		const end = start + itemsPerPage.value
		data_table.value.items = filtered.slice(start, end)
	} catch {
		toast.error('Failed to load orders')
	} finally {
		isLoading.value = false
	}
}

const handlePageChange = (newPage) => {
	currentPage.value = newPage
	loadOrders()
}

const handleItemsPerPageChange = (newItemsPerPage) => {
	itemsPerPage.value = newItemsPerPage
	currentPage.value = 1
	loadOrders()
}

const handleSearch = (query) => {
	searchQuery.value = query
	currentPage.value = 1
	loadOrders()
}

const handleChangeStatus = (order) => {
	selectedOrder.value = order
	selectedStatus.value = order.status
	isChangeStatusDialogVisible.value = true
}

const updateOrderStatus = () => {
	if (!selectedOrder.value) return
	isLoading.value = true
	try {
		const order = mockOrders.value.find(o => o.id === selectedOrder.value.id)
		if (order) {
			order.status = selectedStatus.value
			toast.success(`Order #${order.id} status updated to ${selectedStatus.value}`)
		}
		isChangeStatusDialogVisible.value = false
		loadOrders()
	} catch {
		toast.error('Failed to update status')
	} finally {
		isLoading.value = false
	}
}

const handleViewDetails = (order) => {
	toast.info(`Viewing details for Order #${order.id}`)
}

const exportToExcel = () => {
	toast.success('Orders list exported successfully')
}

// Watch for date range changes in filter store
watch(() => [filterStore.startDate, filterStore.endDate], () => {
	currentPage.value = 1
	loadOrders()
})

onMounted(loadOrders)
</script>
<style>
.v-data-table-header__content {
    color: white !important;
}
</style>
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
                :items="['PENDING', 'ACCEPTED', 'PICKED', 'SHIPPED', 'DELIVERED', 'ONWAY', 'CANCELED', 'RECEIVED']"
                v-model="selectedStatus"
            ></v-select>
		</template>
	</Dialog>

    <Dialog
		v-model="isDetailsDialogVisible"
		title="Order Tracking Details"
		button-text="Close"
		max-width="800px"
        :showButton="true"
        title_align="left"
		@confirm="isDetailsDialogVisible = false"
	>
		<template #content>
            <div v-if="detailsOrder" class="mb-4 space-y-4">
                <div class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">Order ID: {{ detailsOrder.order_id }}</h3>
                        <p class="text-sm text-gray-500">Placed on {{ dayjs(detailsOrder.created_at).format('MMM D, YYYY') }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Total Amount</p>
                        <p class="text-lg font-bold text-primary">₹{{ detailsOrder.total_price?.toLocaleString('en-IN') }}</p>
                    </div>
                </div>
                
                <h3 class="text-lg font-bold px-2 border-b pb-2">Live Status Tracking</h3>
                <!-- OrderTracker Component -->
                <OrderTracker :status="detailsOrder.status" :history="detailsOrder.status_history || []" />
            </div>
		</template>
	</Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useFilterStore } from '~/stores/filterStore'
import Dialog from '~/components/Dialog/Dialog.vue'
import OrderTracker from '~/components/OrderTracker.vue'
import { useOrders } from '~/composables/useOrders'
import dayjs from 'dayjs'

definePageMeta({
	title: 'Sales Orders',
	description: 'Manage Sales Orders',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const filterStore = useFilterStore()
const { getBusinessOrders, updateBusinessOrderStatus } = useOrders()

const currentPage = ref(1)
const itemsPerPage = ref(10)
const isLoading = ref(false)
const isChangeStatusDialogVisible = ref(false)
const isDetailsDialogVisible = ref(false)
const selectedStatus = ref('PENDING')
const selectedOrder = ref(null)
const detailsOrder = ref(null)
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

const loadOrders = async () => {
	isLoading.value = true
	try {
        const params = {
            page: currentPage.value,
            per_page: itemsPerPage.value,
            ...(searchQuery.value && { search: searchQuery.value })
        }
        
        if (filterStore.startDate) {
            params.from_date = dayjs(filterStore.startDate).startOf('day').toISOString()
        }
        if (filterStore.endDate) {
            params.to_date = dayjs(filterStore.endDate).endOf('day').toISOString()
        }

        const res = await getBusinessOrders(params)
        
        const items = res?.data?.items || (Array.isArray(res?.data) ? res.data : [])
        data_table.value.items = items.map(o => ({
            id: o.order_id,
            customer: o.user ? `${o.user.first_name || ''} ${o.user.last_name || ''}`.trim() : `ID: ${o.user_id}`,
            amount: `₹${o.total_price?.toLocaleString('en-IN')}`,
            status: o.status,
            date: dayjs(o.created_at).format('MMM D, YYYY'),
            original: o
        }))
        data_table.value.total_data = res?.data?.total || res?.data?.total_count || items.length || 0
	} catch (err) {
        console.error(err)
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

const updateOrderStatus = async () => {
	if (!selectedOrder.value) return
	isLoading.value = true
	try {
        await updateBusinessOrderStatus(selectedOrder.value.id, selectedStatus.value)
        toast.success(`Order #${selectedOrder.value.id} status updated to ${selectedStatus.value}`)
		isChangeStatusDialogVisible.value = false
		loadOrders()
	} catch (err) {
        console.error(err)
		toast.error('Failed to update status')
	} finally {
		isLoading.value = false
	}
}

const handleViewDetails = (order) => {
	detailsOrder.value = order.original
    isDetailsDialogVisible.value = true
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
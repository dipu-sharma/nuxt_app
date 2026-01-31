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
import { useAuthStore } from '~/stores/auth'
import { useFilterStore } from '~/stores/filterStore'
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useExcel } from '~/composables/useExce'

// Page metadata
definePageMeta({
	title: 'Sales Orders',
	description: 'Manage Sales Orders',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const filterStore = useFilterStore();

// Refs
const isLoading = ref(false)
const search = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isChangeStatusDialogVisible = ref(false)
const selectedOrder = ref(null)
const selectedStatus = ref('')

const mockOrders = [
    { id: 'SO001', user: 'John Doe', products: 'Product A, Product B', total: 250.00, status: 'Delivered', date: '2024-05-20' },
    { id: 'SO002', user: 'Jane Smith', products: 'Product C', total: 150.75, status: 'Pending', date: '2024-05-19' },
    { id: 'SO003', user: 'Sam Wilson', products: 'Product D, Product E, Product F', total: 350.50, status: 'Shipped', date: '2024-05-18' },
    { id: 'SO004', user: 'Lisa Ray', products: 'Product G', total: 50.25, status: 'Cancelled', date: '2024-05-17' },
    { id: 'SO005', user: 'Mike Johnson', products: 'Product H', total: 500.00, status: 'Delivered', date: '2024-05-16' },
    { id: 'SO006', user: 'Anna Williams', products: 'Product I, Product J', total: 75.00, status: 'Pending', date: '2024-05-15' },
    { id: 'SO007', user: 'Chris Brown', products: 'Product K', total: 120.00, status: 'Shipped', date: '2024-05-14' },
    { id: 'SO008', user: 'Patricia Garcia', products: 'Product L', total: 80.00, status: 'Delivered', date: '2024-05-13' },
    { id: 'SO009', user: 'Robert Martinez', products: 'Product M, Product N', total: 220.00, status: 'Cancelled', date: '2024-05-12' },
    { id: 'SO010', user: 'Linda Rodriguez', products: 'Product O', total: 300.00, status: 'Pending', date: '2024-05-11' },
];

const data_table = ref({
	items: [],
	total_data: 0,
	headers: [
		{ title: 'Order ID', value: 'id', sortable: false, align: 'left' },
		{ title: 'Customer', value: 'user', sortable: false, align: 'left' },
		{ title: 'Products', value: 'products', sortable: false, align: 'left' },
        { title: 'Total', value: 'total', sortable: false, align: 'left' },
		{ title: 'Status', value: 'status', sortable: false, align: 'left' },
        { title: 'Date', value: 'date', sortable: false, align: 'left' },
		{ title: '', value: 'actions', sortable: false, align: 'left' },
	],
})

const exportToExcel = () => {
	const { convertToExcel } = useExcel()
    const excelData = data_table.value.items.map(item => ({
        'Order ID': item.id,
        'Customer': item.user,
        'Products': item.products,
        'Total': item.total,
        'Status': item.status,
        'Date': item.date,
    }));
	convertToExcel(excelData, false, 'sales_orders_data.xlsx');
}

const fetchData = () => {
	isLoading.value = true;
    const filteredOrders = mockOrders.filter(order => 
        order.id.toLowerCase().includes(search.value.toLowerCase()) ||
        order.user.toLowerCase().includes(search.value.toLowerCase()) ||
        order.products.toLowerCase().includes(search.value.toLowerCase())
    );

	data_table.value.total_data = filteredOrders.length;
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
	data_table.value.items = filteredOrders.slice(start, end).map((item, i) => ({ ...item, index: start + i + 1 }));
	isLoading.value = false;
}

watch(() => [filterStore.startDate, filterStore.endDate, search], () => {
    fetchData();
});

const handlePageChange = (newPage) => {
	currentPage.value = newPage
	fetchData()
}

const handleItemsPerPageChange = (newItemsPerPage) => {
    itemsPerPage.value = newItemsPerPage;
    currentPage.value = 1; // Reset to first page
    fetchData();
};

const handleSearch = async (search_keyword) => {
	search.value = search_keyword
	fetchData()
}

const handleViewDetails = (item) => {
	toast.info(`Viewing details for order ${item.id}.`);
    // Here you would navigate to an order details page or show a dialog
}

const handleChangeStatus = (item) => {
    selectedOrder.value = item;
    selectedStatus.value = item.status;
    isChangeStatusDialogVisible.value = true;
}

const updateOrderStatus = () => {
    if (selectedOrder.value) {
        const order = data_table.value.items.find(o => o.id === selectedOrder.value.id);
        if (order) {
            order.status = selectedStatus.value;
            toast.success(`Order ${order.id} status updated to ${order.status}.`);
        }
    }
    isChangeStatusDialogVisible.value = false;
}

onMounted(() => {
	fetchData();
})
</script>
<style>
.v-data-table-header__content {
    color: white !important;
}
</style>
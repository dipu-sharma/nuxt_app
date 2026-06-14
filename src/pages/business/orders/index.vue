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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
	title: 'Sales Orders',
	description: 'Manage Sales Orders',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
	layout: 'admin',
})

const { setCookie, getCookie } = useAuth()

const handleCookieSet = async () => {
	await setCookie()
}

const handleCookieGet = async () => {
	const res = await getCookie()
	console.log('Response___________________________', res)
}
</script>
<style>
.v-data-table-header__content {
    color: white !important;
}
</style>
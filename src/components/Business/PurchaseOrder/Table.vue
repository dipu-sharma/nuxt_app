<template>
    <div>
        <TablesTable2
            :headers="headers"
            :items="items"
            :page="currentPage"
            :itemsPerPage="itemsPerPage"
            :item_total="totalItems"
            :loading="isLoading"
            @update="handleEdit"
            @search="handleSearch"
            @delete="handleDelete"
            @page_change="handlePageChange"
            @item_per_page="handleItemsPerPageChange"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import purchaseOrderApi from '~/api/purchaseOrderApi';
import { useFilterStore } from '~/stores/filterStore';

const { getPurchaseOrders } = purchaseOrderApi();
const filterStore = useFilterStore();

const headers = ref([
    { title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
    { title: 'Supplier', value: 'supplier_name' },
    { title: 'Order Date', value: 'order_date' },
    { title: 'Total Amount', value: 'total_amount' },
    { title: 'Status', value: 'status' },
    { title: 'Actions', value: 'actions', sortable: false },
]);

const items = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const isLoading = ref(false);
const search = ref('');

const fetchPurchaseOrders = async () => {
    isLoading.value = true;
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: search.value,
            startDate: filterStore.startDate,
            endDate: filterStore.endDate,
        };
        const response = await getPurchaseOrders(params);
        items.value = response.data.items.map((item, index) => ({ ...item, index: (currentPage.value - 1) * itemsPerPage.value + index + 1 }));
        totalItems.value = response.data.total_items;
    } catch (error) {
        console.error('Failed to fetch purchase orders:', error);
    } finally {
        isLoading.value = false;
    }
};

watch(() => [filterStore.startDate, filterStore.endDate], () => {
    fetchPurchaseOrders();
});

const handlePageChange = (page) => {
    currentPage.value = page;
    fetchPurchaseOrders();
};

const handleItemsPerPageChange = (items) => {
    itemsPerPage.value = items;
    currentPage.value = 1;
    fetchPurchaseOrders();
};

const handleSearch = (query) => {
    search.value = query;
    currentPage.value = 1;
    fetchPurchaseOrders();
};

const handleEdit = (item) => {
    // Logic to edit a purchase order
    console.log('Editing:', item);
};

const handleDelete = (item) => {
    // Logic to delete a purchase order
    console.log('Deleting:', item);
};

onMounted(() => {
    fetchPurchaseOrders();
});
</script>

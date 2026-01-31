<template>
	<div class="p-6">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Manage Products</h1>
			<div>
				<button @click="filterStore.toggleFilterSidebar()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200 mr-2">
					Filter
				</button>
				<button @click="openCreateDialog" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
					Create Product
				</button>
			</div>
		</div>

		<TablesTable2
			:headers="headers"
			:items="products"
			:page="page"
			:itemsPerPage="itemsPerPage"
			:item_total="totalItems"
			:loading="loading"
			@page_change="updatePage"
			@item_per_page="updateItemsPerPage"
            @update="openEditDialog"
            @delete="confirmDeleteProduct"
            @search="handleSearch"
		/>

		<Dialog
			v-model="showEditProductDialog"
			:title="editingProduct ? 'Edit Product' : 'Create Product'"
			button_text="Save"
			@cancel="closeModal"
			@submit="saveProduct"
		>
			<template #content>
				<form @submit.prevent="saveProduct" class="p-4">
                    <div class="grid gap-4">
                        <input v-model="productData.name" placeholder="Product Name" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input v-model.number="productData.price" type="number" placeholder="Price" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input v-model.number="productData.quantity" type="number" placeholder="Quantity" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </form>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import productApi from '~/api/productApi'
import { toast } from 'vue3-toastify'
import Dialog from '~/components/Dialog/Dialog.vue'
import { useFilterStore } from '~/stores/filterStore'

const filterStore = useFilterStore();

definePageMeta({
	title: 'Admin Products',
	layout: 'admin',
	middleware: ['auth-role'],
})

const api = productApi()

const products = ref([])
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const search = ref('')

const showEditProductDialog = ref(false)
const editingProduct = ref(null)

const productData = ref({
	name: '',
	price: '',
	quantity: '',
})

const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Price', value: 'price' },
    { title: 'Quantity', value: 'quantity' },
    { title: 'Actions', value: 'actions', sortable: false },
]

const fetchData = async () => {
	loading.value = true
	try {
		const params = {
			page: page.value,
			per_page: itemsPerPage.value,
            is_paginate: true,
        }
        if(search.value) {
            params.search = search.value
        }
		if (filterStore.startDate) {
			params.startDate = filterStore.startDate.toISOString()
		}
		if (filterStore.endDate) {
			params.endDate = filterStore.endDate.toISOString()
		}
		const response = await api.get_business_product_list(params)
		products.value = response.data.items
		totalItems.value = response.data.total
        page.value = response.data.page
        itemsPerPage.value = response.data.per_page

	} catch (error) {
		toast.error('Failed to fetch products')
	} finally {
		loading.value = false
	}
}

watch(() => [filterStore.startDate, filterStore.endDate], () => {
    fetchData();
});

const openCreateDialog = () => {
	editingProduct.value = null
	productData.value = { name: '', price: '', quantity: '' }
	showEditProductDialog.value = true
}

const openEditDialog = (product) => {
	editingProduct.value = { ...product }
	productData.value = { ...product }
	showEditProductDialog.value = true
}

const closeModal = () => {
	showEditProductDialog.value = false
}

const saveProduct = async () => {
	if (!productData.value.name || !productData.value.price || !productData.value.quantity) {
		toast.error("Please fill all fields")
		return
	}

	try {
		if (editingProduct.value) {
			await api.edit_product(productData.value, editingProduct.value.id)
			toast.success('Product updated')
		} else {
			await api.create_product(productData.value)
			toast.success('Product created')
		}
		closeModal()
		fetchData()
	} catch (error) {
		toast.error('Failed to save product')
	}
}

const confirmDeleteProduct = async (item) => {
    if(!confirm(`Are you sure you want to delete ${item.name}?`)) return
    try {
        await api.delete_product(item.id)
        toast.success('Product deleted')
        fetchData()
    } catch (error) {
        toast.error('Failed to delete product')
    }
}


const updatePage = (newPage) => {
	page.value = newPage
	fetchData()
}

const updateItemsPerPage = (newItemsPerPage) => {
	itemsPerPage.value = newItemsPerPage
    page.value = 1;
	fetchData()
}

const handleSearch = (query) => {
    page.value = 1
    search.value = query
    fetchData()
}

onMounted(() => {
	fetchData()
})
</script>
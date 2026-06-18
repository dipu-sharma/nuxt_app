<template>
	<div class="p-6">
		<div class="flex justify-end items-center mb-6">
			<button @click="openCreateDialog" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
				Create Product
			</button>
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
import { useProducts } from '~/composables/useProducts'
import { toast } from 'vue3-toastify'
import Dialog from '~/components/Dialog/Dialog.vue'
import { useFilterStore } from '~/stores/filterStore'

const filterStore = useFilterStore();

definePageMeta({
	title: 'Products',
	layout: 'admin',
	middleware: ['auth-role'],
})

const { fetchBusinessProducts, createProduct, updateProduct, deleteProduct } = useProducts()

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
		const response = await fetchBusinessProducts(params)
		const list = response?.data?.items || response?.data || []
		products.value = list.map(p => ({
			...p,
			quantity: p.quantity !== undefined ? p.quantity : (p.stock_quantity ?? p.stock ?? 0)
		}))
		totalItems.value = response?.data?.total || list.length
		page.value = response?.data?.page || 1
		itemsPerPage.value = response?.data?.per_page || 10
	} catch (error) {
		console.error(error)
		toast.error('Failed to fetch products')
		products.value = []
		totalItems.value = 0
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
	productData.value = { 
		name: product.name || product.product_name || '',
		price: product.price || product.selling_price || '',
		quantity: product.quantity !== undefined ? product.quantity : (product.stock_quantity ?? product.stock ?? 0)
	}
	showEditProductDialog.value = true
}

const closeModal = () => {
	showEditProductDialog.value = false
}

const saveProduct = async () => {
	if (!productData.value.name || !productData.value.price || productData.value.quantity === undefined) {
		toast.error("Please fill all fields")
		return
	}

	try {
		if (editingProduct.value) {
			await updateProduct(editingProduct.value.id, {
				product_name: productData.value.name,
				selling_price: Number(productData.value.price),
				product_mrp: Number(productData.value.price),
				low_stock_threshold: 10
			})
			toast.success('Product updated successfully')
		} else {
			await createProduct({
				product_name: productData.value.name,
				selling_price: Number(productData.value.price),
				product_mrp: Number(productData.value.price),
				low_stock_threshold: 10
			})
			toast.success('Product created successfully')
		}
		closeModal()
		fetchData()
	} catch (error) {
		console.error(error)
		toast.error('Failed to save product')
	}
}

const confirmDeleteProduct = async (item) => {
    if(!confirm(`Are you sure you want to delete ${item.name}?`)) return
    try {
		await deleteProduct(item.id)
		toast.success('Product deleted successfully')
        fetchData()
    } catch (error) {
		console.error(error)
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
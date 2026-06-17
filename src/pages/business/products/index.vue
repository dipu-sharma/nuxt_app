<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">My Products</h1>
				<p class="text-sm opacity-60 mt-1">Manage your product catalogue</p>
			</div>
			<div class="flex gap-3">
				<button @click="exportCsv" class="px-4 py-2 rounded-lg text-sm font-medium border"
					style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
					↓ Export CSV
				</button>
				<button @click="openCreate" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">
					+ Add Product
				</button>
			</div>
		</div>

		<!-- Search -->
		<div class="rounded-xl p-4 mb-6 flex gap-3"
			style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
			<input v-model="search" @keyup.enter="loadProducts" placeholder="Search products..."
				class="flex-1 px-4 py-2 rounded-lg text-sm"
				style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
			<button @click="loadProducts" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
				style="background-color: rgb(var(--color-primary))">Search</button>
		</div>

		<!-- Table -->
		<div class="rounded-xl shadow overflow-hidden" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
			<div v-if="loading" class="p-8 text-center opacity-60">Loading products...</div>
			<div v-else-if="products.length === 0" class="p-12 text-center">
				<div class="text-5xl mb-4">📦</div>
				<p class="opacity-60 mb-4">No products yet</p>
				<button @click="openCreate" class="px-6 py-2 rounded-lg text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">Add First Product</button>
			</div>
			<table v-else class="w-full text-sm">
				<thead style="background-color: rgb(var(--color-background))">
					<tr>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Product</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Category</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Price</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Stock</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Status</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="product in products" :key="product.id"
						class="border-t hover:opacity-90 transition-opacity"
						style="border-color: rgb(var(--color-border))">
						<td class="px-4 py-3">
							<div class="flex items-center gap-3">
								<img v-if="product.images?.[0]?.url" :src="product.images[0].url"
									class="w-10 h-10 rounded-lg object-cover" />
								<div v-else class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
									style="background-color: rgb(var(--color-background))">📦</div>
								<div>
									<p class="font-medium">{{ product.name }}</p>
									<p class="text-xs opacity-60">ID: {{ product.id }}</p>
								</div>
							</div>
						</td>
						<td class="px-4 py-3 opacity-70">{{ product.category?.name || product.category_name || '—' }}</td>
						<td class="px-4 py-3 font-semibold" style="color: rgb(var(--color-primary))">${{ product.price }}</td>
						<td class="px-4 py-3">
							<span :class="product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'">
								{{ product.stock_quantity ?? '—' }}
							</span>
						</td>
						<td class="px-4 py-3">
							<span class="px-2 py-1 text-xs rounded-full"
								:class="product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
								{{ product.is_active ? 'Active' : 'Inactive' }}
							</span>
						</td>
						<td class="px-4 py-3">
							<div class="flex gap-2">
								<button @click="openEdit(product)" class="px-2 py-1 text-xs rounded border"
									style="border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary))">Edit</button>
								<button @click="deleteProduct(product)" class="px-2 py-1 text-xs rounded border border-red-300 text-red-600">Delete</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Product Modal -->
		<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div class="rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
				style="background-color: rgb(var(--color-card))">
				<h2 class="text-lg font-bold mb-4">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="sm:col-span-2">
						<label class="text-xs opacity-70 mb-1 block">Product Name *</label>
						<input v-model="form.name" placeholder="Product Name"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs opacity-70 mb-1 block">Description</label>
						<textarea v-model="form.description" rows="3" placeholder="Product Description"
							class="w-full px-4 py-2 rounded-lg text-sm resize-none"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))"></textarea>
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Price *</label>
						<input v-model="form.price" type="number" step="0.01" placeholder="0.00"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Stock Quantity</label>
						<input v-model="form.stock_quantity" type="number" placeholder="0"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">SKU</label>
						<input v-model="form.sku" placeholder="SKU-001"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Category</label>
						<input v-model="form.category_name" placeholder="Category Name"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div class="sm:col-span-2 flex items-center gap-3">
						<input type="checkbox" v-model="form.is_active" id="is_active" class="w-4 h-4" />
						<label for="is_active" class="text-sm">Active (visible to customers)</label>
					</div>
				</div>
				<div class="flex gap-3 mt-6">
					<button @click="showModal = false" class="flex-1 py-2 rounded-lg text-sm border"
						style="border-color: rgb(var(--color-border))">Cancel</button>
					<button @click="saveProduct" :disabled="saving"
						class="flex-1 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ saving ? 'Saving...' : (editingProduct ? 'Update' : 'Create') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Products',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const loading = ref(false)
const saving = ref(false)
const products = ref([])
const search = ref('')
const showModal = ref(false)
const editingProduct = ref(null)
const form = ref({ name: '', description: '', price: '', stock_quantity: 0, sku: '', category_name: '', is_active: true })

const loadProducts = async () => {
	loading.value = true
	try {
		const { getProducts } = useBusinessProducts()
		const res = await getProducts(search.value ? { search: search.value } : {})
		products.value = res?.data?.items || res?.data || []
	} catch {
		toast.error('Failed to load products')
	} finally {
		loading.value = false
	}
}

const openCreate = () => {
	editingProduct.value = null
	form.value = { name: '', description: '', price: '', stock_quantity: 0, sku: '', category_name: '', is_active: true }
	showModal.value = true
}

const openEdit = (product) => {
	editingProduct.value = product
	form.value = { ...product }
	showModal.value = true
}

const saveProduct = async () => {
	if (!form.value.name || !form.value.price) return toast.error('Name and price are required')
	saving.value = true
	try {
		const { createProduct, updateProduct } = useBusinessProducts()
		if (editingProduct.value) {
			await updateProduct(editingProduct.value.id, form.value)
			toast.success('Product updated')
		} else {
			await createProduct(form.value)
			toast.success('Product created')
		}
		showModal.value = false
		loadProducts()
	} catch {
		toast.error('Failed to save product')
	} finally {
		saving.value = false
	}
}

const deleteProduct = async (product) => {
	if (!confirm(`Delete "${product.name}"?`)) return
	try {
		const { deleteProduct: doDelete } = useBusinessProducts()
		await doDelete(product.id)
		toast.success('Product deleted')
		loadProducts()
	} catch {
		toast.error('Failed to delete product')
	}
}

const exportCsv = async () => {
	try {
		const { exportCsv: doExport } = useBusinessProducts()
		await doExport()
		toast.success('CSV export initiated')
	} catch {
		toast.error('Export failed')
	}
}

onMounted(loadProducts)
</script>

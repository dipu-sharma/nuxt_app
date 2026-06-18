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
			<input v-model="search" @input="debouncedSearch" @keyup.enter="loadProducts" placeholder="Search products..."
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
			<div v-if="hasMore" class="p-4 text-center border-t" style="border-color: rgb(var(--color-border))">
				<button @click="loadMore" :disabled="loadingMore" class="px-6 py-2 rounded-lg text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">
					{{ loadingMore ? 'Loading...' : 'Load More' }}
				</button>
			</div>
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
					<div class="sm:col-span-2">
						<label class="text-xs opacity-70 mb-1 block">Short Description</label>
						<input v-model="form.short_description" placeholder="Brief tagline or summary"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Brand Name</label>
						<input v-model="form.brand_name" placeholder="Brand Name"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Category Name</label>
						<input v-model="form.category_name" placeholder="Category Name"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">MRP (Regular Price) *</label>
						<input v-model="form.price" type="number" step="0.01" placeholder="0.00"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Discount Percent (%)</label>
						<input v-model="form.discount_percent" type="number" step="0.1" placeholder="0"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Cost Price</label>
						<input v-model="form.cost_price" type="number" step="0.01" placeholder="0.00"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Tax Percent (%)</label>
						<input v-model="form.product_tax" type="number" step="0.1" placeholder="0"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Stock / Low Threshold</label>
						<input v-model="form.stock_quantity" type="number" placeholder="10"
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
						<label class="text-xs opacity-70 mb-1 block">HSN No</label>
						<input v-model="form.hsn_no" placeholder="HSN-001"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Batch No</label>
						<input v-model="form.batch_no" placeholder="B-2026"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Size</label>
						<input v-model="form.size" placeholder="L, XL, etc."
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Color</label>
						<input v-model="form.color" placeholder="Black, Red, etc."
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Product Type</label>
						<input v-model="form.product_type" placeholder="FASHION, ELECTRONICS"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Product Unit</label>
						<input v-model="form.product_unit" placeholder="PCS, KG, etc."
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Packing Details</label>
						<input v-model="form.product_packing" placeholder="Box, Bottle, etc."
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div class="sm:col-span-2 flex flex-wrap items-center gap-6 mt-2">
						<div class="flex items-center gap-2">
							<input type="checkbox" v-model="form.is_active" id="is_active" class="w-4 h-4" />
							<label for="is_active" class="text-sm">Active</label>
						</div>
						<div class="flex items-center gap-2">
							<input type="checkbox" v-model="form.is_featured" id="is_featured" class="w-4 h-4" />
							<label for="is_featured" class="text-sm">Featured Product</label>
						</div>
					</div>
				</div>
				<ProductImageUpload v-if="editingProduct" :productId="editingProduct.id" @uploaded="onImageUploaded" />
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
import { ProductPayloadSchema } from '@/utils/schemas'
import ProductImageUpload from '@/components/ProductImageUpload.vue'

definePageMeta({
	title: 'Products',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const loading = ref(false)
const loadingMore = ref(false)
const saving = ref(false)
const products = ref([])
const search = ref('')
const cursor = ref(null)
const hasMore = ref(false)
const showModal = ref(false)
const editingProduct = ref(null)
const defaultForm = { 
	name: '', description: '', short_description: '', brand_name: '',
	price: '', cost_price: '', discount_percent: '', 
	stock_quantity: 0, sku: '', hsn_no: '', size: '', color: '', batch_no: '', 
	product_tax: '', product_packing: '', product_type: '', product_unit: '',
	category_name: '', is_active: true, is_featured: false 
}
const form = ref({ ...defaultForm })

let debounceTimer = null
const debouncedSearch = () => {
	clearTimeout(debounceTimer)
	debounceTimer = setTimeout(loadProducts, 400)
}

const loadProducts = async () => {
	loading.value = true
	try {
		const { getProducts } = useBusinessProducts()
		const params = { limit: 20 }
		if (search.value) params.search = search.value

		const res = await getProducts(params)
		products.value = res?.data?.items || res?.data || []
		cursor.value = res?.data?.next_cursor || null
		hasMore.value = !!res?.data?.has_more
	} catch (error) {
		console.error(error)
		toast.error('Failed to fetch products')
		products.value = []
	} finally {
		loading.value = false
	}
}

const loadMore = async () => {
	if (loadingMore.value || !hasMore.value) return
	loadingMore.value = true
	try {
		const { getProducts } = useBusinessProducts()
		const params = { limit: 20, cursor: cursor.value }
		if (search.value) params.search = search.value

		const res = await getProducts(params)
		const newItems = res?.data?.items || res?.data || []
		products.value.push(...newItems)
		cursor.value = res?.data?.next_cursor || null
		hasMore.value = !!res?.data?.has_more
	} catch (error) {
		console.error('Failed to load more products', error)
	} finally {
		loadingMore.value = false
	}
}

const openCreate = () => {
	editingProduct.value = null
	form.value = { ...defaultForm }
	showModal.value = true
}

const openEdit = (product) => {
	editingProduct.value = product
	form.value = {
		name: product.name || product.product_name || '',
		description: product.description || '',
		short_description: product.short_description || '',
		brand_name: product.brand_name || '',
		price: product.price || product.product_mrp || product.selling_price || '',
		cost_price: product.product_cost_price || '',
		discount_percent: product.discount_percent || '',
		stock_quantity: product.stock_quantity || product.stock || product.low_stock_threshold || 10,
		sku: product.sku || product.product_sku || '',
		hsn_no: product.hsn_no || '',
		size: product.size || '',
		color: product.color || '',
		batch_no: product.batch_no || '',
		product_tax: product.product_tax || '',
		product_packing: product.product_packing || '',
		product_type: product.product_type || '',
		product_unit: product.product_unit || '',
		category_name: product.category?.name || product.category_name || '',
		is_active: product.is_active !== undefined ? product.is_active : true,
		is_featured: product.is_featured || false
	}
	showModal.value = true
}

const onImageUploaded = () => {
	loadProducts() // Refresh to show new image in list
}

const saveProduct = async () => {
	saving.value = true
	try {
		const payload = {
			product_name: form.value.name,
			description: form.value.description || '',
			short_description: form.value.short_description || undefined,
			brand_name: form.value.brand_name || undefined,
			product_mrp: Number(form.value.price),
			selling_price: Number(form.value.price),
			product_cost_price: form.value.cost_price ? Number(form.value.cost_price) : undefined,
			discount_percent: form.value.discount_percent ? Number(form.value.discount_percent) : undefined,
			product_sku: form.value.sku || undefined,
			hsn_no: form.value.hsn_no || undefined,
			size: form.value.size || undefined,
			color: form.value.color || undefined,
			batch_no: form.value.batch_no || undefined,
			product_tax: form.value.product_tax ? Number(form.value.product_tax) : undefined,
			product_packing: form.value.product_packing || undefined,
			product_type: form.value.product_type || undefined,
			product_unit: form.value.product_unit || undefined,
			is_active: form.value.is_active,
			is_featured: form.value.is_featured,
			low_stock_threshold: Number(form.value.stock_quantity) || 10
		}
		
		// Zod Validation
		const parsed = ProductPayloadSchema.safeParse(payload)
		if (!parsed.success) {
			toast.error(parsed.error.errors[0].message)
			saving.value = false
			return
		}
		
		const { createProduct, updateProduct } = useBusinessProducts()
		
		if (editingProduct.value) {
			await updateProduct(editingProduct.value.id, parsed.data)
			toast.success('Product updated successfully')
		} else {
			await createProduct(parsed.data)
			toast.success('Product created successfully')
		}
		showModal.value = false
		loadProducts()
	} catch (error) {
		console.error(error)
		toast.error('Failed to save product')
	} finally {
		saving.value = false
	}
}

const deleteProduct = async (product) => {
	if (!confirm(`Delete "${product.name || product.product_name}"?`)) return
	try {
		const { deleteProduct: doDelete } = useBusinessProducts()
		await doDelete(product.id)
		toast.success('Product deleted successfully')
		loadProducts()
	} catch (error) {
		console.error(error)
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

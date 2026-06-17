<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="mb-6">
			<h1 class="text-2xl font-bold">Inventory Management</h1>
			<p class="text-sm opacity-60 mt-1">Manage suppliers, purchase orders and stock</p>
		</div>

		<!-- Tabs -->
		<div class="flex gap-1 mb-6 p-1 rounded-xl w-fit" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
			<button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
				class="px-5 py-2 rounded-lg text-sm font-medium transition-all"
				:style="activeTab === tab.key
					? 'background-color: rgb(var(--color-primary)); color: white'
					: 'color: rgb(var(--color-text)); opacity: 0.7'">
				{{ tab.label }}
			</button>
		</div>

		<!-- SUPPLIERS TAB -->
		<div v-if="activeTab === 'suppliers'">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-semibold">Suppliers</h2>
				<button @click="openSupplierModal()" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">+ Add Supplier</button>
			</div>
			<div class="rounded-xl overflow-hidden shadow" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div v-if="loadingSuppliers" class="p-8 text-center opacity-60">Loading...</div>
				<div v-else-if="suppliers.length === 0" class="p-8 text-center opacity-60">No suppliers yet</div>
				<table v-else class="w-full text-sm">
					<thead style="background-color: rgb(var(--color-background))">
						<tr>
							<th class="px-4 py-3 text-left opacity-70">Name</th>
							<th class="px-4 py-3 text-left opacity-70">Email</th>
							<th class="px-4 py-3 text-left opacity-70">Phone</th>
							<th class="px-4 py-3 text-left opacity-70">Country</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="s in suppliers" :key="s.id" class="border-t"
							style="border-color: rgb(var(--color-border))">
							<td class="px-4 py-3 font-medium">{{ s.name }}</td>
							<td class="px-4 py-3 opacity-70">{{ s.email || '—' }}</td>
							<td class="px-4 py-3 opacity-70">{{ s.phone || '—' }}</td>
							<td class="px-4 py-3 opacity-70">{{ s.country || '—' }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- PURCHASE ORDERS TAB -->
		<div v-if="activeTab === 'orders'">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-semibold">Purchase Orders</h2>
				<button @click="openPOModal()" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">+ New PO</button>
			</div>
			<div class="rounded-xl overflow-hidden shadow" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div v-if="loadingPO" class="p-8 text-center opacity-60">Loading...</div>
				<div v-else-if="purchaseOrders.length === 0" class="p-8 text-center opacity-60">No purchase orders yet</div>
				<table v-else class="w-full text-sm">
					<thead style="background-color: rgb(var(--color-background))">
						<tr>
							<th class="px-4 py-3 text-left opacity-70">PO #</th>
							<th class="px-4 py-3 text-left opacity-70">Supplier</th>
							<th class="px-4 py-3 text-left opacity-70">Total</th>
							<th class="px-4 py-3 text-left opacity-70">Status</th>
							<th class="px-4 py-3 text-left opacity-70">Date</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="po in purchaseOrders" :key="po.id" class="border-t"
							style="border-color: rgb(var(--color-border))">
							<td class="px-4 py-3 font-mono">#{{ po.id }}</td>
							<td class="px-4 py-3 opacity-70">{{ po.supplier?.name || po.supplier_id }}</td>
							<td class="px-4 py-3 font-semibold" style="color: rgb(var(--color-primary))">${{ po.total_amount || '—' }}</td>
							<td class="px-4 py-3">
								<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{{ po.status || 'pending' }}</span>
							</td>
							<td class="px-4 py-3 opacity-70 text-xs">{{ formatDate(po.created_at) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- STOCK ADJUST TAB -->
		<div v-if="activeTab === 'stock'">
			<h2 class="text-lg font-semibold mb-4">Manual Stock Adjustment</h2>
			<div class="rounded-xl p-6 max-w-lg shadow" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="space-y-4">
					<div>
						<label class="text-xs opacity-70 mb-1 block">Product ID *</label>
						<input v-model="stockForm.product_id" type="number" placeholder="Product ID"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Adjustment Type</label>
						<select v-model="stockForm.adjustment_type"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))">
							<option value="add">Add Stock</option>
							<option value="remove">Remove Stock</option>
							<option value="set">Set Exact Value</option>
						</select>
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Quantity *</label>
						<input v-model="stockForm.quantity" type="number" placeholder="0"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<div>
						<label class="text-xs opacity-70 mb-1 block">Reason</label>
						<input v-model="stockForm.reason" placeholder="Reason for adjustment"
							class="w-full px-4 py-2 rounded-lg text-sm"
							style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					</div>
					<button @click="submitStockAdjust" :disabled="adjusting"
						class="w-full py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ adjusting ? 'Adjusting...' : 'Apply Adjustment' }}
					</button>
				</div>
			</div>
		</div>

		<!-- Supplier Modal -->
		<div v-if="showSupplierModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="rounded-xl p-6 w-full max-w-md shadow-xl" style="background-color: rgb(var(--color-card))">
				<h2 class="text-lg font-bold mb-4">Add Supplier</h2>
				<div class="space-y-3">
					<input v-model="supplierForm.name" placeholder="Supplier Name *"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="supplierForm.email" placeholder="Email" type="email"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="supplierForm.phone" placeholder="Phone"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="supplierForm.country" placeholder="Country"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
				</div>
				<div class="flex gap-3 mt-6">
					<button @click="showSupplierModal = false" class="flex-1 py-2 rounded-lg text-sm border"
						style="border-color: rgb(var(--color-border))">Cancel</button>
					<button @click="saveSupplier" :disabled="savingSupplier"
						class="flex-1 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ savingSupplier ? 'Saving...' : 'Add Supplier' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Inventory',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const tabs = [
	{ key: 'suppliers', label: 'Suppliers' },
	{ key: 'orders', label: 'Purchase Orders' },
	{ key: 'stock', label: 'Stock Adjustment' },
]
const activeTab = ref('suppliers')

const suppliers = ref([])
const purchaseOrders = ref([])
const loadingSuppliers = ref(false)
const loadingPO = ref(false)
const adjusting = ref(false)
const savingSupplier = ref(false)
const showSupplierModal = ref(false)
const supplierForm = ref({ name: '', email: '', phone: '', country: '' })
const stockForm = ref({ product_id: '', adjustment_type: 'add', quantity: '', reason: '' })

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

const loadSuppliers = async () => {
	loadingSuppliers.value = true
	try {
		const { getSuppliers } = useInventory()
		const res = await getSuppliers()
		suppliers.value = res?.data?.items || res?.data || []
	} catch { toast.error('Failed to load suppliers') }
	finally { loadingSuppliers.value = false }
}

const loadPO = async () => {
	loadingPO.value = true
	try {
		const { getPurchaseOrders } = useInventory()
		const res = await getPurchaseOrders()
		purchaseOrders.value = res?.data?.items || res?.data || []
	} catch { toast.error('Failed to load purchase orders') }
	finally { loadingPO.value = false }
}

const openSupplierModal = () => {
	supplierForm.value = { name: '', email: '', phone: '', country: '' }
	showSupplierModal.value = true
}

const saveSupplier = async () => {
	if (!supplierForm.value.name) return toast.error('Supplier name is required')
	savingSupplier.value = true
	try {
		const { createSupplier } = useInventory()
		await createSupplier(supplierForm.value)
		toast.success('Supplier added')
		showSupplierModal.value = false
		loadSuppliers()
	} catch { toast.error('Failed to add supplier') }
	finally { savingSupplier.value = false }
}

const openPOModal = () => {
	toast.info('Use the form below or API to create a purchase order')
}

const submitStockAdjust = async () => {
	if (!stockForm.value.product_id || !stockForm.value.quantity) return toast.error('Product ID and quantity required')
	adjusting.value = true
	try {
		const { adjustStock } = useInventory()
		await adjustStock(stockForm.value)
		toast.success('Stock adjusted successfully')
		stockForm.value = { product_id: '', adjustment_type: 'add', quantity: '', reason: '' }
	} catch { toast.error('Stock adjustment failed') }
	finally { adjusting.value = false }
}

watch(activeTab, (tab) => {
	if (tab === 'suppliers') loadSuppliers()
	if (tab === 'orders') loadPO()
})

onMounted(loadSuppliers)
</script>

<template>
	<div class="p-6"
		style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">Business Management</h1>
				<p class="text-sm opacity-60 mt-1">Approve, suspend and manage businesses</p>
			</div>
			<button @click="showCreateModal = true"
				class="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
				style="background-color: rgb(var(--color-primary))">
				+ Create Business
			</button>
		</div>

		<!-- Businesses Grid -->
		<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="i in 6" :key="i" class="h-40 rounded-xl animate-pulse"
				style="background-color: rgb(var(--color-card))" />
		</div>
		<div v-else-if="businesses.length === 0" class="text-center py-16 opacity-50">
			<div class="text-5xl mb-4">🏢</div>
			<p>No businesses registered yet</p>
		</div>
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="biz in businesses" :key="biz.id" class="rounded-xl p-6 shadow transition-shadow hover:shadow-lg"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-start justify-between mb-4">
					<div>
						<h3 class="font-bold text-base">{{ biz.business_name || biz.name }}</h3>
						<p class="text-xs opacity-60 mt-1">{{ biz.business_email || biz.email }}</p>
					</div>
					<span class="px-2 py-1 text-xs rounded-full font-medium"
						:class="bizStatusClass(biz.status || biz.is_active)">
						{{ biz.status || (biz.is_active ? 'Active' : 'Inactive') }}
					</span>
				</div>
				<div class="text-xs opacity-60 space-y-1 mb-4">
					<p>📞 {{ biz.business_phone || '—' }}</p>
					<p>📦 {{ biz.total_products ?? '—' }} products</p>
					<p>🗓 {{ formatDate(biz.created_at) }}</p>
				</div>
				<div class="flex flex-col gap-2 pt-3" style="border-top: 1px solid rgb(var(--color-border))">
					<div class="flex gap-2">
						<!-- Approve / Approved Button -->
						<button v-if="isApproved(biz)" disabled
							class="flex-1 py-1.5 text-xs rounded-lg font-medium bg-green-100 text-green-700 cursor-not-allowed">
							✓ Approved
						</button>
						<button v-else @click="approveBiz(biz)"
							class="flex-1 py-1.5 text-xs rounded-lg font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
							style="background-color: rgb(var(--color-primary))">
							✓ Approve
						</button>

						<!-- Suspend / Suspended Button -->
						<button v-if="isSuspended(biz)" disabled
							class="flex-1 py-1.5 text-xs rounded-lg font-medium bg-red-100 text-red-700 cursor-not-allowed">
							⏸ Suspended
						</button>
						<button v-else @click="suspendBiz(biz)"
							class="flex-1 py-1.5 text-xs rounded-lg font-medium border"
							style="color: rgb(var(--color-text)); border-color: rgb(var(--color-border))">
							⏸ Suspend
						</button>
					</div>
					<button @click="viewProducts(biz)"
						class="w-full py-1.5 text-xs rounded-lg font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
						style="background-color: rgb(var(--color-primary))">
						📦 View Products
					</button>
				</div>
			</div>
		</div>

		<!-- Create Business Modal -->
		<div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="rounded-xl p-6 w-full max-w-lg shadow-xl" style="background-color: rgb(var(--color-card))">
				<h2 class="text-lg font-bold mb-4">Create New Business</h2>
				<div class="space-y-3">
					<input v-model="createForm.business_name" placeholder="Business Name *"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="createForm.business_email" placeholder="Business Email *" type="email"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="createForm.business_phone" placeholder="Phone Number"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="createForm.owner_email" placeholder="Owner Email *"
						class="w-full px-4 py-2 rounded-lg text-sm"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<textarea v-model="createForm.description" placeholder="Business Description" rows="3"
						class="w-full px-4 py-2 rounded-lg text-sm resize-none"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))"></textarea>
				</div>
				<div class="flex gap-3 mt-6">
					<button @click="showCreateModal = false" class="flex-1 py-2 rounded-lg text-sm border"
						style="border-color: rgb(var(--color-border))">Cancel</button>
					<button @click="confirmCreate" :disabled="creating"
						class="flex-1 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ creating ? 'Creating...' : 'Create' }}
					</button>
				</div>
			</div>
		</div>

		<!-- View Products Modal -->
		<div v-if="showProductsModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div class="rounded-2xl p-6 w-full max-w-4xl shadow-xl flex flex-col justify-between max-h-[85vh] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between mb-4 pb-2 border-b border-border">
					<h2 class="text-xl font-bold text-text">Products of {{ selectedBiz?.business_name ||
						selectedBiz?.name }}</h2>
					<button @click="showProductsModal = false"
						class="text-text opacity-70 hover:opacity-100 text-lg">✕</button>
				</div>

				<div class="overflow-y-auto flex-1 mb-4 pr-1">
					<v-progress-circular v-if="loadingBizProducts" indeterminate color="primary"
						class="d-flex mx-auto my-16" />
					<div v-else-if="bizProducts.length === 0" class="text-center py-16 opacity-50 text-text">
						No products found for this business.
					</div>
					<div v-else class="overflow-x-auto rounded-xl border border-border/50">
						<table class="w-full text-sm">
							<thead style="background-color: rgb(var(--color-background))">
								<tr>
									<th class="px-4 py-3 text-left font-semibold opacity-70">ID</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Name</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Price</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Stock</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="prod in bizProducts" :key="prod?.id || prod?.product_id" class="border-t" style="border-color: rgb(var(--color-border))">
									<td class="px-4 py-3 font-mono text-xs opacity-60">{{ prod?.id || prod?.product_id }}</td>
									<td class="px-4 py-3 font-medium">{{ prod?.product_name || prod?.name || '—' }}</td>
									<td class="px-4 py-3 text-indigo-600">₹{{ (prod?.selling_price || prod?.product_mrp ||
										prod?.price)?.toLocaleString('en-IN') || '0.00' }}</td>
									<td class="px-4 py-3">
										<span class="px-2 py-0.5 rounded-full text-xs font-semibold"
											:class="(prod?.low_stock_threshold !== undefined ? prod?.low_stock_threshold : (prod?.stock_quantity ?? 0)) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-750'">
											{{ prod?.low_stock_threshold !== undefined ? prod?.low_stock_threshold :
												(prod?.stock_quantity ?? 0) }} units
										</span>
									</td>
									<td class="px-4 py-3">
										<span class="px-2 py-0.5 rounded-full text-xs font-semibold"
											:class="prod?.is_active ? 'bg-primary/10 text-primary' : 'bg-secondary text-text opacity-50'">
											{{ prod?.is_active ? 'Active' : 'Inactive' }}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Pagination Controls -->
				<div v-if="bizProductsMeta.total_pages > 1"
					class="flex justify-between items-center pt-4 border-t border-border">
					<button :disabled="bizProductsPage === 1" @click="changeBizProductsPage(bizProductsPage - 1)"
						class="px-4 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50"
						style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
						Previous
					</button>
					<span class="text-sm text-text opacity-75">Page {{ bizProductsPage }} of {{
						bizProductsMeta.total_pages }}</span>
					<button :disabled="bizProductsPage === bizProductsMeta.total_pages"
						@click="changeBizProductsPage(bizProductsPage + 1)"
						class="px-4 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50"
						style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Business Management',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['ADMIN'],
})

const loading = ref(false)
const creating = ref(false)
const businesses = ref([])
const showCreateModal = ref(false)
const createForm = ref({ business_name: '', business_email: '', business_phone: '', owner_email: '', description: '' })

// View products state
const showProductsModal = ref(false)
const selectedBiz = ref(null)
const bizProducts = ref([])
const bizProductsPage = ref(1)
const bizProductsMeta = ref({ total_items: 0, total_pages: 0, current_page: 1, limit: 10 })
const loadingBizProducts = ref(false)

const viewProducts = async (biz) => {
	console.log("Business", biz)
	selectedBiz.value = biz
	bizProductsPage.value = 1
	showProductsModal.value = true
	await loadBizProducts()
}

const loadBizProducts = async () => {
	if (!selectedBiz.value) return
	loadingBizProducts.value = true
	try {
		const { getAdminBusinessProducts } = useBusinessProducts()
		const res = await getAdminBusinessProducts(selectedBiz.value?.business_id || selectedBiz.value?.id, {
			page: bizProductsPage.value,
			limit: 10,
		})

		const rawItems = res?.data?.items || (Array.isArray(res?.data) ? res.data : [])
		bizProducts.value = rawItems.filter(p => p !== null && p !== undefined)
		
		const limit = res?.data?.limit || res?.limit || 10
		const total = res?.data?.total || res?.total || bizProducts.value.length
		const totalPages = res?.data?.total_pages || res?.total_pages || Math.ceil(total / limit)
		
		bizProductsMeta.value = res?.meta || {
			total_items: total,
			total_pages: totalPages || 1,
			current_page: bizProductsPage.value,
			limit: limit,
		}
	} catch {
		bizProducts.value = []
	} finally {
		loadingBizProducts.value = false
	}
}

const changeBizProductsPage = async (newPage) => {
	bizProductsPage.value = newPage
	await loadBizProducts()
}

const isApproved = (biz) => {
	if (!biz) return false
	const status = typeof biz.status === 'string' ? biz.status.toLowerCase() : ''
	return status === 'approved' || status === 'active' || biz.is_active === true
}

const isSuspended = (biz) => {
	if (!biz) return false
	const status = typeof biz.status === 'string' ? biz.status.toLowerCase() : ''
	return status === 'suspended'
}

const bizStatusClass = (status) => {
	if (status === true || status === 'approved' || status === 'active') return 'bg-green-100 text-green-700'
	if (status === 'suspended') return 'bg-red-100 text-red-700'
	return 'bg-yellow-100 text-yellow-700'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

const loadBusinesses = async () => {
	loading.value = true
	try {
		const { getBusinesses } = useAdminUsers()
		const res = await getBusinesses()
		businesses.value = res?.data?.items || res?.data || res || []
	} catch {
		businesses.value = []
	} finally {
		loading.value = false
	}
}

const approveBiz = async (biz) => {
	try {
		const { approveBusiness } = useAdminUsers()
		await approveBusiness(biz.id)
		loadBusinesses()
	} catch {
		loadBusinesses()
	}
}

const suspendBiz = async (biz) => {
	try {
		const { suspendBusiness } = useAdminUsers()
		await suspendBusiness(biz.id)
		loadBusinesses()
	} catch {
		loadBusinesses()
	}
}

const confirmCreate = async () => {
	if (!createForm.value.business_name || !createForm.value.business_email) {
		return toast.error('Business name and email are required')
	}
	creating.value = true
	try {
		const { createBusiness } = useAdminUsers()
		await createBusiness(createForm.value)
		showCreateModal.value = false
		createForm.value = { business_name: '', business_email: '', business_phone: '', owner_email: '', description: '' }
		loadBusinesses()
	} catch {
	} finally {
		creating.value = false
	}
}

onMounted(loadBusinesses)
</script>

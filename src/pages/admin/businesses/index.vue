<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">Business Management</h1>
				<p class="text-sm opacity-60 mt-1">Approve, suspend and manage businesses</p>
			</div>
			<button @click="showCreateModal = true" class="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
				style="background-color: rgb(var(--color-primary))">
				+ Create Business
			</button>
		</div>

		<!-- Businesses Grid -->
		<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="i in 6" :key="i" class="h-40 rounded-xl animate-pulse" style="background-color: rgb(var(--color-card))" />
		</div>
		<div v-else-if="businesses.length === 0" class="text-center py-16 opacity-50">
			<div class="text-5xl mb-4">🏢</div>
			<p>No businesses registered yet</p>
		</div>
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="biz in businesses" :key="biz.id"
				class="rounded-xl p-6 shadow transition-shadow hover:shadow-lg"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-start justify-between mb-4">
					<div>
						<h3 class="font-bold text-base">{{ biz.business_name || biz.name }}</h3>
						<p class="text-xs opacity-60 mt-1">{{ biz.business_email || biz.email }}</p>
					</div>
					<span class="px-2 py-1 text-xs rounded-full font-medium" :class="bizStatusClass(biz.status || biz.is_active)">
						{{ biz.status || (biz.is_active ? 'Active' : 'Inactive') }}
					</span>
				</div>
				<div class="text-xs opacity-60 space-y-1 mb-4">
					<p>📞 {{ biz.business_phone || '—' }}</p>
					<p>📦 {{ biz.total_products ?? '—' }} products</p>
					<p>🗓 {{ formatDate(biz.created_at) }}</p>
				</div>
				<div class="flex gap-2 pt-3" style="border-top: 1px solid rgb(var(--color-border))">
					<button @click="approveBiz(biz)" v-if="biz.status !== 'approved'"
						class="flex-1 py-1.5 text-xs rounded-lg font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						✓ Approve
					</button>
					<button @click="suspendBiz(biz)"
						class="flex-1 py-1.5 text-xs rounded-lg font-medium border"
						style="color: rgb(var(--color-text)); border-color: rgb(var(--color-border))">
						⏸ Suspend
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
		toast.error('Failed to load businesses')
	} finally {
		loading.value = false
	}
}

const approveBiz = async (biz) => {
	try {
		const { approveBusiness } = useAdminUsers()
		await approveBusiness(biz.id)
		toast.success('Business approved')
		loadBusinesses()
	} catch {
		toast.error('Failed to approve business')
	}
}

const suspendBiz = async (biz) => {
	try {
		const { suspendBusiness } = useAdminUsers()
		await suspendBusiness(biz.id)
		toast.success('Business suspended')
		loadBusinesses()
	} catch {
		toast.error('Failed to suspend business')
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
		toast.success('Business created successfully')
		showCreateModal.value = false
		createForm.value = { business_name: '', business_email: '', business_phone: '', owner_email: '', description: '' }
		loadBusinesses()
	} catch {
		toast.error('Failed to create business')
	} finally {
		creating.value = false
	}
}

onMounted(loadBusinesses)
</script>

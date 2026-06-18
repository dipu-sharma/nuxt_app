<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<!-- Header -->
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">User Management</h1>
				<p class="text-sm opacity-60 mt-1">Manage all registered users</p>
			</div>
		</div>

		<!-- Filters -->
		<div class="rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center"
			style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
			<input v-model="search" @input="debouncedSearch" @keyup.enter="loadUsers" type="text" placeholder="Search by email..."
				class="flex-1 min-w-48 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
				style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
			<select v-model="filterRole" @change="loadUsers"
				class="px-4 py-2 rounded-lg text-sm focus:outline-none"
				style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))">
				<option value="">All Roles</option>
				<option value="ADMIN">Admin</option>
				<option value="BUSINESS_OWNER">Business Owner</option>
				<option value="BUSINESS_MEMBER">Business Member</option>
				<option value="USER">Customer</option>
			</select>
			<button @click="loadUsers" class="px-4 py-2 rounded-lg text-sm font-medium text-white"
				style="background-color: rgb(var(--color-primary))">
				Search
			</button>
		</div>

		<!-- Table -->
		<div class="rounded-xl shadow overflow-hidden" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
			<div v-if="loading" class="p-8 text-center opacity-60">Loading users...</div>
			<div v-else-if="users.length === 0" class="p-8 text-center opacity-60">No users found</div>
			<table v-else class="w-full text-sm">
				<thead style="background-color: rgb(var(--color-background))">
					<tr>
						<th class="px-4 py-3 text-left font-semibold opacity-70">#</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">User</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Role</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Mobile</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Status</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Joined</th>
						<th class="px-4 py-3 text-left font-semibold opacity-70">Actions</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(user, i) in users" :key="user.id"
						class="border-t transition-colors hover:opacity-90"
						style="border-color: rgb(var(--color-border))">
						<td class="px-4 py-3 opacity-50">{{ i + 1 }}</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
									style="background-color: rgb(var(--color-primary))">
									{{ (user.username || user.email_id || 'U')[0].toUpperCase() }}
								</div>
								<div>
									<p class="font-medium">{{ user.username || '—' }}</p>
									<p class="text-xs opacity-60">{{ user.email_id }}</p>
								</div>
							</div>
						</td>
						<td class="px-4 py-3">
							<span class="px-2 py-1 rounded-full text-xs font-medium" :class="roleClass(user.user_type)">
								{{ user.user_type }}
							</span>
						</td>
						<td class="px-4 py-3 opacity-70">{{ user.mobile_number || '—' }}</td>
						<td class="px-4 py-3">
							<span class="px-2 py-1 rounded-full text-xs font-medium"
								:class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
								{{ user.is_active ? 'Active' : 'Inactive' }}
							</span>
						</td>
						<td class="px-4 py-3 opacity-70 text-xs">{{ formatDate(user.created_at) }}</td>
						<td class="px-4 py-3">
							<div class="flex gap-2">
								<button v-if="user.user_type === 'USER'" @click="promoteUser(user)"
									class="px-2 py-1 text-xs rounded font-medium text-white"
									style="background-color: rgb(var(--color-primary))">
									→ Business
								</button>
								<span v-else class="text-xs opacity-40">—</span>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Promote Modal -->
		<div v-if="showPromoteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div class="rounded-xl p-6 w-full max-w-md shadow-xl" style="background-color: rgb(var(--color-card))">
				<h2 class="text-lg font-bold mb-4">Promote to Business Owner</h2>
				<p class="text-sm opacity-70 mb-4">Promoting: <strong>{{ selectedUser?.email_id }}</strong></p>
				<div class="space-y-3">
					<input v-model="promoteForm.business_name" placeholder="Business Name"
						class="w-full px-4 py-2 rounded-lg text-sm focus:outline-none"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="promoteForm.business_email" placeholder="Business Email"
						class="w-full px-4 py-2 rounded-lg text-sm focus:outline-none"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<input v-model="promoteForm.business_phone" placeholder="Business Phone"
						class="w-full px-4 py-2 rounded-lg text-sm focus:outline-none"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
				</div>
				<div class="flex gap-3 mt-6">
					<button @click="showPromoteModal = false" class="flex-1 py-2 rounded-lg text-sm border"
						style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">Cancel</button>
					<button @click="confirmPromote" :disabled="promoting"
						class="flex-1 py-2 rounded-lg text-sm font-medium text-white"
						style="background-color: rgb(var(--color-primary))">
						{{ promoting ? 'Promoting...' : 'Confirm' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'User Management',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['ADMIN'],
})

const loading = ref(false)
const promoting = ref(false)
const users = ref([])
const search = ref('')
const filterRole = ref('')
const showPromoteModal = ref(false)
const selectedUser = ref(null)
const promoteForm = ref({ business_name: '', business_email: '', business_phone: '' })

const roleClass = (role) => {
	const map = {
		ADMIN: 'bg-purple-100 text-purple-700',
		BUSINESS_OWNER: 'bg-blue-100 text-blue-700',
		BUSINESS_MEMBER: 'bg-indigo-100 text-indigo-700',
		USER: 'bg-gray-100 text-gray-700',
	}
	return map[role] || 'bg-gray-100 text-gray-700'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

let debounceTimer = null
const debouncedSearch = () => {
	clearTimeout(debounceTimer)
	debounceTimer = setTimeout(loadUsers, 400)
}

const loadUsers = async () => {
	loading.value = true
	try {
		const { getUserList } = useAdminUsers()
		const payload = {}
		if (search.value) payload.search = search.value
		if (filterRole.value) payload.user_type = filterRole.value
		const res = await getUserList(payload)
		users.value = res?.data?.items || res?.data || res || []
	} catch {
		toast.error('Failed to load users')
	} finally {
		loading.value = false
	}
}

const promoteUser = (user) => {
	selectedUser.value = user
	promoteForm.value = { business_name: '', business_email: user.email_id, business_phone: user.mobile_number || '' }
	showPromoteModal.value = true
}

const confirmPromote = async () => {
	if (!promoteForm.value.business_name) return toast.error('Business name is required')
	promoting.value = true
	try {
		const { updateVendorDetails } = useAdminUsers()
		await updateVendorDetails({
			user_id: selectedUser.value.id,
			...promoteForm.value,
		})
		toast.success('User promoted to Business Owner')
		showPromoteModal.value = false
		loadUsers()
	} catch {
		toast.error('Failed to promote user')
	} finally {
		promoting.value = false
	}
}

onMounted(loadUsers)
</script>

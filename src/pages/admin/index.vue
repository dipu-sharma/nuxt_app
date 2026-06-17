<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold" style="color: rgb(var(--color-text))">Admin Dashboard</h1>
				<p class="text-sm mt-1" style="color: rgb(var(--color-text)); opacity: 0.7">Welcome back! Here's what's happening today.</p>
			</div>
			<button @click="loadDashboard" :disabled="loading" class="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
				style="background-color: rgb(var(--color-primary)); color: white">
				<svg :class="{ 'animate-spin': loading }" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				Refresh
			</button>
		</div>

		<!-- Metric Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div v-for="card in metricCards" :key="card.label"
				class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text)); opacity: 0.7">{{ card.label }}</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">
							<span v-if="loading">—</span>
							<span v-else>{{ card.value }}</span>
						</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Recent Orders + Recent Users -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Recent Orders -->
			<div class="rounded-xl shadow-lg p-6" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold" style="color: rgb(var(--color-text))">Recent Orders</h3>
					<NuxtLink to="/admin/orders" class="text-sm font-medium" style="color: rgb(var(--color-primary))">View all →</NuxtLink>
				</div>
				<div v-if="loading" class="space-y-3">
					<div v-for="i in 4" :key="i" class="h-10 rounded-lg animate-pulse" style="background-color: rgb(var(--color-border))" />
				</div>
				<div v-else-if="recentOrders.length === 0" class="text-center py-8 opacity-50">No orders yet</div>
				<div v-else class="space-y-3">
					<div v-for="order in recentOrders" :key="order.id"
						class="flex items-center justify-between p-3 rounded-lg"
						style="background-color: rgb(var(--color-background))">
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">#{{ order.order_number || order.id }}</p>
							<p class="text-xs opacity-60" style="color: rgb(var(--color-text))">{{ order.user?.username || 'Customer' }}</p>
						</div>
						<div class="text-right">
							<p class="text-sm font-semibold" style="color: rgb(var(--color-primary))">${{ order.total_amount || '0.00' }}</p>
							<span class="text-xs px-2 py-0.5 rounded-full" :class="statusClass(order.status)">{{ order.status }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Users -->
			<div class="rounded-xl shadow-lg p-6" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold" style="color: rgb(var(--color-text))">Recent Users</h3>
					<NuxtLink to="/admin/users" class="text-sm font-medium" style="color: rgb(var(--color-primary))">View all →</NuxtLink>
				</div>
				<div v-if="loading" class="space-y-3">
					<div v-for="i in 4" :key="i" class="h-10 rounded-lg animate-pulse" style="background-color: rgb(var(--color-border))" />
				</div>
				<div v-else-if="recentUsers.length === 0" class="text-center py-8 opacity-50">No users yet</div>
				<div v-else class="space-y-3">
					<div v-for="user in recentUsers" :key="user.id"
						class="flex items-center gap-3 p-3 rounded-lg"
						style="background-color: rgb(var(--color-background))">
						<div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
							style="background-color: rgb(var(--color-primary))">
							{{ (user.username || user.email_id || 'U')[0].toUpperCase() }}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium truncate" style="color: rgb(var(--color-text))">{{ user.username || user.email_id }}</p>
							<p class="text-xs opacity-60" style="color: rgb(var(--color-text))">{{ user.user_type }}</p>
						</div>
						<span class="text-xs px-2 py-0.5 rounded-full"
							:class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
							{{ user.is_active ? 'Active' : 'Inactive' }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<NuxtLink to="/admin/users" class="p-4 rounded-xl text-center transition-transform hover:scale-105 shadow"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="text-2xl mb-1">👥</div>
				<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Users</p>
			</NuxtLink>
			<NuxtLink to="/admin/businesses" class="p-4 rounded-xl text-center transition-transform hover:scale-105 shadow"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="text-2xl mb-1">🏢</div>
				<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Businesses</p>
			</NuxtLink>
			<NuxtLink to="/admin/orders" class="p-4 rounded-xl text-center transition-transform hover:scale-105 shadow"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="text-2xl mb-1">📦</div>
				<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Orders</p>
			</NuxtLink>
			<NuxtLink to="/admin/products" class="p-4 rounded-xl text-center transition-transform hover:scale-105 shadow"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="text-2xl mb-1">🛍️</div>
				<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Products</p>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Dashboard',
	description: 'Admin dashboard overview',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['ADMIN'],
})

const loading = ref(false)
const stats = ref({})
const recentOrders = ref([])
const recentUsers = ref([])

const metricCards = computed(() => [
	{
		label: 'Total Users',
		value: stats.value.total_users ?? '—',
		icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
	},
	{
		label: 'Total Businesses',
		value: stats.value.total_businesses ?? '—',
		icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
	},
	{
		label: 'Total Orders',
		value: stats.value.total_orders ?? '—',
		icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
	},
	{
		label: 'Total Revenue',
		value: stats.value.total_revenue ? `$${Number(stats.value.total_revenue).toLocaleString()}` : '—',
		icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
	},
])

const statusClass = (status) => {
	const map = {
		PENDING: 'bg-yellow-100 text-yellow-700',
		PROCESSING: 'bg-blue-100 text-blue-700',
		COMPLETED: 'bg-green-100 text-green-700',
		CANCELLED: 'bg-red-100 text-red-700',
	}
	return map[status] || 'bg-gray-100 text-gray-700'
}

const loadDashboard = async () => {
	loading.value = true
	try {
		const { getDashboard } = useAdminDashboard()
		const res = await getDashboard()
		const data = res?.data || res || {}
		stats.value = data.stats || data
		recentOrders.value = data.recent_orders || []
		recentUsers.value = data.recent_users || []
	} catch {
		toast.error('Failed to load dashboard data')
	} finally {
		loading.value = false
	}
}

onMounted(loadDashboard)
</script>

<template>
	<div class="p-6 md:p-8 min-h-screen transition-colors duration-300" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text))">
		<!-- Executive Hero Header -->
		<div class="mb-8 p-6 rounded-3xl shadow-lg border relative overflow-hidden backdrop-blur-xl transition-all duration-300"
			style="background-color: rgb(var(--color-card) / 0.85); border-color: rgb(var(--color-border))">
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
				<div>
					<div class="flex items-center gap-2 mb-2">
						<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
							<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							Live Merchant Telemetry
						</span>
						<span v-if="businessInfo.currency_code" class="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-secondary/30 text-text/80 border border-border/40">
							Currency: {{ businessInfo.currency_code }} ({{ businessInfo.currency_symbol || '$' }})
						</span>
					</div>
					<h1 class="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5" style="color: rgb(var(--color-text))">
						<span>Welcome back, {{ businessInfo.business_name || 'Merchant' }}</span>
					</h1>
					<p class="text-xs md:text-sm font-medium opacity-70 mt-1">Here is the real-time operational analysis and financial performance of your store today.</p>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<!-- Date Filters -->
					<div class="flex items-center gap-2 bg-secondary/20 p-1.5 rounded-xl border border-border/50 text-xs">
						<input type="date" v-model="startDate" @change="loadData" class="px-2.5 py-1 rounded-lg bg-background border border-border/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50" />
						<span class="opacity-50 font-bold">to</span>
						<input type="date" v-model="endDate" @change="loadData" class="px-2.5 py-1 rounded-lg bg-background border border-border/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50" />
					</div>
					<button @click="loadData" :disabled="loading"
						class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
						style="background-color: rgb(var(--color-primary)); color: rgb(var(--color-button-text), #ffffff)">
						<Icon name="mdi:refresh" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
						<span>{{ loading ? 'Updating...' : 'Refresh Telemetry' }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Total Orders -->
			<div class="p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col justify-between"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-start justify-between mb-3">
						<div>
							<p class="text-xs font-extrabold uppercase tracking-wider opacity-65 mb-1 text-blue-500">Total Orders</p>
							<div v-if="loading" class="w-24 h-8 bg-secondary/30 animate-pulse rounded-lg my-1"></div>
							<p v-else class="text-3xl font-black tracking-tight" style="color: rgb(var(--color-text))">{{ metrics.total_orders || 0 }}</p>
						</div>
						<div class="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0 shadow-inner">
							<Icon name="mdi:cart-outline" class="w-6 h-6" />
						</div>
					</div>
				</div>
				<div class="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold">
					<span class="opacity-60 font-medium">vs prior period</span>
					<span :class="[metrics.orders_change_percentage >= 0 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'px-2 py-0.5 rounded-lg border flex items-center gap-1 text-[11px]']">
						<Icon :name="metrics.orders_change_percentage >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'" class="w-3.5 h-3.5" />
						<span>{{ metrics.orders_change_percentage >= 0 ? '+' : '' }}{{ metrics.orders_change_percentage ?? '0' }}%</span>
					</span>
				</div>
			</div>

			<!-- Revenue -->
			<div class="p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col justify-between"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-start justify-between mb-3">
						<div>
							<p class="text-xs font-extrabold uppercase tracking-wider opacity-65 mb-1 text-emerald-500">Net Revenue</p>
							<div v-if="loading" class="w-32 h-8 bg-secondary/30 animate-pulse rounded-lg my-1"></div>
							<p v-else class="text-3xl font-black tracking-tight" style="color: rgb(var(--color-text))">{{ formatCurrency(metrics.total_revenue) }}</p>
						</div>
						<div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0 shadow-inner">
							<Icon name="mdi:currency-usd" class="w-6 h-6" />
						</div>
					</div>
				</div>
				<div class="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold">
					<span class="opacity-60 font-medium">Growth trajectory</span>
					<span :class="[metrics.revenue_change_percentage >= 0 ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20', 'px-2 py-0.5 rounded-lg border flex items-center gap-1 text-[11px]']">
						<Icon :name="metrics.revenue_change_percentage >= 0 ? 'mdi:chart-line' : 'mdi:chart-line-down'" class="w-3.5 h-3.5" />
						<span>{{ metrics.revenue_change_percentage >= 0 ? '+' : '' }}{{ metrics.revenue_change_percentage ?? '0' }}%</span>
					</span>
				</div>
			</div>

			<!-- Average Rating -->
			<div class="p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col justify-between"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-start justify-between mb-3">
						<div>
							<p class="text-xs font-extrabold uppercase tracking-wider opacity-65 mb-1 text-amber-500">Customer Satisfaction</p>
							<div v-if="loading" class="w-20 h-8 bg-secondary/30 animate-pulse rounded-lg my-1"></div>
							<p v-else class="text-3xl font-black tracking-tight flex items-baseline gap-1" style="color: rgb(var(--color-text))">
								<span>{{ metrics.average_rating || '0.0' }}</span>
								<span class="text-xs font-extrabold text-amber-500 uppercase tracking-wide">/ 5.0</span>
							</p>
						</div>
						<div class="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0 shadow-inner">
							<Icon name="mdi:star" class="w-6 h-6" />
						</div>
					</div>
				</div>
				<div class="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold">
					<span class="opacity-60 font-medium">Verified ratings</span>
					<span class="px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold text-[11px]">
						{{ metrics.total_reviews || 0 }} reviews
					</span>
				</div>
			</div>

			<!-- Pending Orders -->
			<div class="p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col justify-between"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-start justify-between mb-3">
						<div>
							<p class="text-xs font-extrabold uppercase tracking-wider opacity-65 mb-1 text-purple-500">Pending Fulfillment</p>
							<div v-if="loading" class="w-16 h-8 bg-secondary/30 animate-pulse rounded-lg my-1"></div>
							<p v-else class="text-3xl font-black tracking-tight text-purple-500">{{ metrics.pending_orders || 0 }}</p>
						</div>
						<div class="p-3 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shrink-0 shadow-inner">
							<Icon name="mdi:clock-fast" class="w-6 h-6" />
						</div>
					</div>
				</div>
				<div class="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold">
					<span class="opacity-60 font-medium">Daily variation</span>
					<span class="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[11px] flex items-center gap-1">
						<span>{{ metrics.pending_orders_diff_yesterday >= 0 ? '+' : '' }}{{ metrics.pending_orders_diff_yesterday || 0 }} vs yesterday</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Charts Section -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
			<!-- Sales Overview Chart (8 cols on lg) -->
			<div class="lg:col-span-7 p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-center justify-between mb-1">
						<h3 class="font-bold text-base" style="color: rgb(var(--color-text))">Sales Overview</h3>
						<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">Revenue Timeline</span>
					</div>
					<p class="text-xs opacity-60 mb-4 font-medium">Time-series daily trajectory of revenue and transaction activity</p>
				</div>
				<div class="w-full h-[260px] relative my-2 overflow-hidden flex items-center justify-center">
					<div v-if="loading" class="w-full h-full rounded-2xl animate-pulse bg-secondary/20"></div>
					<GraphBaseChart v-else type="line" :data="salesLineChartData" :options="lineChartOptions" height="260px" />
				</div>
			</div>

			<!-- Sales by Category Chart (5 cols on lg) -->
			<div class="lg:col-span-5 p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-center justify-between mb-1">
						<h3 class="font-bold text-base" style="color: rgb(var(--color-text))">Sales by Category</h3>
						<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">Merchandise Share</span>
					</div>
					<p class="text-xs opacity-60 mb-4 font-medium">Revenue distribution across registered product categories</p>
				</div>
				<div class="w-full h-[260px] relative my-2 overflow-hidden flex items-center justify-center">
					<div v-if="loading" class="w-full h-full rounded-2xl animate-pulse bg-secondary/20"></div>
					<GraphBaseChart v-else type="bar" :data="categoryBarChartData" :options="barChartOptions" height="260px" />
				</div>
			</div>
		</div>

		<!-- Bottom Interactive Suite -->
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
			<!-- Order Status Distribution (4 cols) -->
			<div class="lg:col-span-4 p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-center justify-between mb-1">
						<h3 class="font-bold text-base" style="color: rgb(var(--color-text))">Order Status</h3>
						<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">Fulfillment</span>
					</div>
					<p class="text-xs opacity-60 mb-4 font-medium">Current workflow status ratios across total orders</p>
				</div>

				<div class="w-full h-[200px] relative my-2 overflow-hidden flex items-center justify-center">
					<div v-if="loading" class="w-full h-full rounded-2xl animate-pulse bg-secondary/20"></div>
					<template v-else>
						<GraphBaseChart type="doughnut" :data="orderStatusChartData" :options="doughnutChartOptions" height="200px" />
						<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
							<span class="text-3xl font-black tracking-tight text-emerald-500">{{ metrics.total_orders || 0 }}</span>
							<span class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mt-0.5">Orders</span>
						</div>
					</template>
				</div>

				<!-- Custom Reactive HTML Legend -->
				<div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/50 text-xs">
					<div v-for="item in statusLegendItems" :key="item.label" class="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-secondary/20 border border-border/30">
						<div class="flex items-center gap-2 truncate pr-1">
							<span class="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" :style="{ backgroundColor: item.color }"></span>
							<span class="font-bold opacity-85 truncate text-[11px]" style="color: rgb(var(--color-text))">{{ item.label }}</span>
						</div>
						<span class="font-black px-1.5 py-0.5 rounded-md text-[11px]" :style="{ color: item.color, backgroundColor: 'rgb(var(--color-background))' }">{{ item.count }}</span>
					</div>
				</div>
			</div>

			<!-- Recent Orders Table (5 cols) -->
			<div class="lg:col-span-5 p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div>
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold text-base" style="color: rgb(var(--color-text))">Recent Orders</h3>
						<NuxtLink to="/business/orders" class="text-xs font-extrabold text-primary hover:underline flex items-center gap-1">
							<span>View All</span>
							<Icon name="mdi:arrow-right" class="w-3.5 h-3.5" />
						</NuxtLink>
					</div>

					<div v-if="loading" class="space-y-3">
						<div v-for="i in 4" :key="i" class="h-12 rounded-xl animate-pulse bg-secondary/20"></div>
					</div>
					<div v-else-if="recentOrders.length === 0" class="p-8 text-center text-xs opacity-60 bg-secondary/10 rounded-xl border border-dashed border-border">
						<Icon name="mdi:clipboard-text-off" class="w-8 h-8 mx-auto mb-2 opacity-50" />
						<span>No recent transaction records found.</span>
					</div>
					<div v-else class="space-y-3">
						<div v-for="ord in recentOrders" :key="ord.order_id || ord.order_number"
							class="flex items-center justify-between p-3 rounded-xl bg-secondary/10 hover:bg-secondary/20 border border-border/40 transition-all duration-200">
							<div class="flex items-center gap-3 min-w-0 pr-2">
								<div class="w-2 h-8 rounded-full shrink-0 bg-primary/80"></div>
								<div class="truncate">
									<div class="flex items-center gap-2">
										<span class="text-sm font-bold truncate" style="color: rgb(var(--color-text))">{{ ord.order_number || `#${ord.order_id?.slice(0,8)}` }}</span>
										<span class="text-xs font-black text-emerald-500">{{ formatCurrency(ord.total_amount) }}</span>
									</div>
									<p class="text-[11px] opacity-65 font-medium truncate">{{ ord.customer_name || 'Customer' }} • {{ formatDate(ord.created_at) }}</p>
								</div>
							</div>
							<span :class="[getStatusColor(ord.status), 'px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider shrink-0 shadow-sm']">
								{{ ord.status || 'PENDING' }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Top Products & Quick Actions (3 cols) -->
			<div class="lg:col-span-3 flex flex-col gap-6">
				<!-- Top Selling Products -->
				<div class="p-6 rounded-2xl shadow-lg border flex flex-col justify-between transition-all duration-300 hover:shadow-xl flex-1"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<div>
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-bold text-base" style="color: rgb(var(--color-text))">Top Products</h3>
							<NuxtLink to="/business/products" class="text-[11px] font-bold text-primary hover:underline">Manage</NuxtLink>
						</div>
						<div v-if="loading" class="space-y-3">
							<div v-for="i in 3" :key="i" class="h-10 rounded-xl animate-pulse bg-secondary/20"></div>
						</div>
						<div v-else-if="topProducts.length === 0" class="p-4 text-center text-xs opacity-60 bg-secondary/10 rounded-xl border border-dashed border-border">
							<span>No inventory sales data available.</span>
						</div>
						<div v-else class="space-y-3">
							<div v-for="(prod, idx) in topProducts" :key="prod.product_id" class="p-2.5 rounded-xl bg-secondary/10 border border-border/40 flex items-center justify-between gap-2">
								<div class="min-w-0 pr-2">
									<div class="flex items-center gap-1.5">
										<span class="w-4 h-4 rounded-full bg-primary/20 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">{{ idx + 1 }}</span>
										<p class="text-xs font-bold truncate" style="color: rgb(var(--color-text))">{{ prod.product_name }}</p>
									</div>
									<p class="text-[10px] font-semibold opacity-60 pl-5 mt-0.5">{{ prod.quantity_sold ?? 0 }} units sold</p>
								</div>
								<span class="text-xs font-black text-emerald-500 shrink-0">{{ formatCurrency(prod.total_revenue_generated) }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<h3 class="font-bold text-base mb-3.5" style="color: rgb(var(--color-text))">Quick Actions</h3>
					<div class="space-y-2.5">
						<NuxtLink to="/business/products"
							class="w-full p-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-95"
							style="background-color: rgb(var(--color-primary)); color: rgb(var(--color-button-text), #ffffff)">
							<Icon name="mdi:plus-circle-outline" class="w-4 h-4" />
							<span>Add New Product</span>
						</NuxtLink>
						<NuxtLink to="/business/orders"
							class="w-full p-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-2.5 border hover:bg-secondary/20"
							style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
							<Icon name="mdi:format-list-bulleted" class="w-4 h-4 text-primary" />
							<span>Manage Orders</span>
						</NuxtLink>
						<NuxtLink to="/business/members"
							class="w-full p-2.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-2.5 border hover:bg-secondary/20"
							style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
							<Icon name="mdi:account-group-outline" class="w-4 h-4 text-secondary-500" />
							<span>Manage Members</span>
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBusinessDashboard } from '~/composables/useBusinessDashboard'

definePageMeta({
	title: 'Business Dashboard',
	description: 'Live operational analytics and revenue telemetry for business owners and managers',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const loading = ref(true)
const businessInfo = ref<any>({})
const metrics = ref<any>({})
const charts = ref<any>({})
const recentOrders = ref<any[]>([])
const topProducts = ref<any[]>([])

const startDate = ref('')
const endDate = ref('')

const formatCurrency = (val: any) => {
	if (val === undefined || val === null) return '$0.00'
	const num = typeof val === 'number' ? val : parseFloat(val) || 0
	const sym = businessInfo.value?.currency_symbol || '$'
	return `${sym}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatDate = (dateStr: any) => {
	if (!dateStr) return '—'
	try {
		const d = new Date(dateStr)
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
	} catch (e) {
		return dateStr
	}
}

const getStatusColor = (status: any) => {
	const s = String(status || '').toUpperCase()
	const map: Record<string, string> = {
		DELIVERED: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
		COMPLETED: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
		SHIPPED: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
		PROCESSING: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30',
		PENDING: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
		CANCELLED: 'bg-red-500/15 text-red-500 border-red-500/30',
		REFUNDED: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
	}
	return map[s] || 'bg-secondary/30 text-text border-border'
}

// Chart 1: Sales Overview (Time-Series)
const salesLineChartData = computed(() => {
	const list = charts.value?.sales_overview || []
	const labels = list.map((item: any) => {
		const d = new Date(item.date)
		return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : (item.date || 'Day')
	})
	const data = list.map((item: any) => item.revenue || 0)
	
	return {
		labels: labels.length ? labels : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
		datasets: [
			{
				label: 'Revenue',
				data: data.length ? data : [0, 0, 0, 0, 0],
				borderColor: '#3B82F6',
				backgroundColor: 'rgba(59, 130, 246, 0.15)',
				fill: true,
				tension: 0.35,
				borderWidth: 3,
				pointBackgroundColor: '#3B82F6',
				pointBorderColor: '#ffffff',
				pointBorderWidth: 2,
				pointRadius: 4,
				pointHoverRadius: 6,
			}
		]
	}
})

const lineChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		datalabels: { display: false }
	},
	scales: {
		x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11, weight: '600' } } },
		y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 11 }, callback: (val: any) => `${businessInfo.value?.currency_symbol || '$'}${val}` } }
	}
}

// Chart 2: Sales by Category
const categoryBarChartData = computed(() => {
	const list = charts.value?.sales_by_category || []
	const labels = list.map((item: any) => item.category_name || 'Category')
	const data = list.map((item: any) => item.revenue || 0)
	
	return {
		labels: labels.length ? labels : ['General', 'Electronics', 'Apparel'],
		datasets: [
			{
				label: 'Category Revenue',
				data: data.length ? data : [1, 1, 1],
				backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
				borderRadius: 6,
				borderWidth: 0,
				maxBarThickness: 36,
			}
		]
	}
})

const barChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		datalabels: {
			color: '#ffffff',
			anchor: 'end',
			align: 'top',
			font: { weight: 'bold', size: 11 },
			formatter: (val: any) => val > 0 ? `${businessInfo.value?.currency_symbol || '$'}${val}` : ''
		}
	},
	scales: {
		x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11, weight: '600' } } },
		y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)', drawBorder: false }, ticks: { color: '#64748b', font: { size: 11 } } }
	}
}

// Chart 3: Order Status Distribution
const statusColorsMap: Record<string, string> = {
	DELIVERED: '#10B981',
	COMPLETED: '#10B981',
	SHIPPED: '#3B82F6',
	PROCESSING: '#6366F1',
	PENDING: '#F59E0B',
	CANCELLED: '#EF4444',
	REFUNDED: '#8B5CF6'
}

const orderStatusChartData = computed(() => {
	const dist = charts.value?.order_status_distribution || {}
	const keys = Object.keys(dist)
	const data = Object.values(dist)
	const colors = keys.map(k => statusColorsMap[k.toUpperCase()] || '#64748B')
	
	return {
		labels: keys.length ? keys.map(k => k.charAt(0) + k.slice(1).toLowerCase()) : ['Delivered', 'Pending', 'Shipped'],
		datasets: [
			{
				data: data.length ? data : [1, 0, 0],
				backgroundColor: colors.length ? colors : ['#10B981', '#F59E0B', '#3B82F6'],
				borderWidth: 0,
				hoverOffset: 4,
			}
		]
	}
})

const doughnutChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	cutout: '76%',
	plugins: {
		legend: { display: false },
		datalabels: { display: false }
	},
	scales: {
		x: { display: false, grid: { display: false }, ticks: { display: false } },
		y: { display: false, grid: { display: false }, ticks: { display: false } },
	}
}

const statusLegendItems = computed(() => {
	const dist = charts.value?.order_status_distribution || {}
	return Object.entries(dist).map(([status, count]) => ({
		label: status.charAt(0) + status.slice(1).toLowerCase(),
		color: statusColorsMap[status.toUpperCase()] || '#64748B',
		count
	}))
})

const loadData = async () => {
	loading.value = true
	try {
		const { getDashboard } = useBusinessDashboard()
		const res = await getDashboard({
			limit: 5,
			start_date: startDate.value || undefined,
			end_date: endDate.value || undefined
		}).catch(() => null)

		const data = res?.data || res || {}
		businessInfo.value = data.business_info || {}
		metrics.value = data.metrics || {
			total_orders: 0,
			orders_change_percentage: 0,
			total_revenue: 0,
			revenue_change_percentage: 0,
			average_rating: 0,
			total_reviews: 0,
			pending_orders: 0,
			pending_orders_diff_yesterday: 0
		}
		charts.value = data.charts || {
			sales_overview: [],
			sales_by_category: [],
			order_status_distribution: {}
		}
		recentOrders.value = data.recent_orders || []
		topProducts.value = data.top_selling_products || []
	} catch (error) {
		console.error('Error fetching business dashboard telemetry:', error)
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadData()
})
</script>


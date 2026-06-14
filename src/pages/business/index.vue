<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<!-- Header Section -->
		<div class="mb-8">
			<p class="text-lg" style="color: rgb(var(--color-text))">Welcome back! Here's what's happening with your business today.</p>
		</div>

		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Total Orders -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Total Orders</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">1,245</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+12% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Revenue -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Revenue</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">$24,560</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+8% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Average Rating -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Avg. Rating</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">4.7</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">From 128 reviews</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Pending Orders -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Pending Orders</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">24</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">-3 from yesterday</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Charts Section -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Sales Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-xl font-semibold" style="color: rgb(var(--color-text))">Sales Overview</h3>
					<div class="flex gap-4">
						<input type="date" class="px-3 py-1 rounded border text-sm" style="border-color: rgb(var(--color-border)); background-color: rgb(var(--color-background)); color: rgb(var(--color-text))">
						<input type="date" class="px-3 py-1 rounded border text-sm" style="border-color: rgb(var(--color-border)); background-color: rgb(var(--color-background)); color: rgb(var(--color-text))">
					</div>
				</div>
				<div class="h-64 flex items-center justify-center">
					<GraphLineChart />
				</div>
			</div>
			<!-- Sales by Category Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Sales by Category</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphBarChart />
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Order Status Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Order Status</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphDoughnutChart />
				</div>
			</div>
			<!-- Recent Orders -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Recent Orders</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-primary))"></div>
							<div>
								<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Order #12345</p>
								<p class="text-xs" style="color: rgb(var(--color-text))">$299.00 - 2 hours ago</p>
							</div>
						</div>
						<span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgb(var(--color-accent)); color: white">Completed</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-secondary))"></div>
							<div>
								<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Order #12344</p>
								<p class="text-xs" style="color: rgb(var(--color-text))">$149.50 - 4 hours ago</p>
							</div>
						</div>
						<span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgb(var(--color-primary)); color: white">Processing</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-accent))"></div>
							<div>
								<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Order #12343</p>
								<p class="text-xs" style="color: rgb(var(--color-text))">$89.99 - 6 hours ago</p>
							</div>
						</div>
						<span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgb(var(--color-secondary)); color: white">Shipped</span>
					</div>
				</div>
			</div>

			<!-- Top Products -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Top Products</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Wireless Headphones</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">247 sales</p>
						</div>
						<div class="w-16 h-2 rounded-full" style="background-color: rgb(var(--color-primary))"></div>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Smart Watch</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">189 sales</p>
						</div>
						<div class="w-12 h-2 rounded-full" style="background-color: rgb(var(--color-accent))"></div>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Bluetooth Speaker</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">156 sales</p>
						</div>
						<div class="w-10 h-2 rounded-full" style="background-color: rgb(var(--color-secondary))"></div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Quick Actions</h3>
				<div class="space-y-3">
					<NuxtLink to="/business/products" class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3 block"
						style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Add New Product</span>
					</NuxtLink>
					<NuxtLink to="/business/orders" class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3 block border-2"
						style="border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary)); background-color: transparent">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<span>Manage Orders</span>
					</NuxtLink>
					<NuxtLink to="/business/employees" class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3 block border-2"
						style="border-color: rgb(var(--color-secondary)); color: rgb(var(--color-text)); background-color: transparent">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
						</svg>
						<span>Manage Employees</span>
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Dashboard',
	description: 'Business owner dashboard',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})
</script>

<template>
	<div class="p-6" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<!-- Header Section -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-2" style="color: rgb(var(--color-text))">Admin Dashboard</h1>
			<p class="text-lg" style="color: rgb(var(--color-text))">Welcome back! Here's what's happening with your platform today.</p>
		</div>

		<!-- Key Metrics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- Total Users -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Total Users</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">2,847</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+12% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Total Businesses -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Total Businesses</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">156</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+8% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Total Products -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Total Products</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">1,429</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+23% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
						</svg>
					</div>
				</div>
			</div>

			<!-- Total Revenue -->
			<div class="p-6 rounded-xl shadow-lg transition-transform hover:scale-105" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium mb-1" style="color: rgb(var(--color-text))">Total Revenue</p>
						<p class="text-3xl font-bold" style="color: rgb(var(--color-primary))">$45,231</p>
						<p class="text-xs mt-1" style="color: rgb(var(--color-accent))">+15% from last month</p>
					</div>
					<div class="p-3 rounded-full" style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Charts Section -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Revenue Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Revenue Overview</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphLineChart />
				</div>
			</div>

			<!-- User Growth Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">User Growth</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphBarChart />
				</div>
			</div>
		</div>

		<!-- Small Charts and Activity Section -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
			<!-- Product Types Chart -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Product Types</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphDoughnutChart />
				</div>
			</div>
			
			<!-- Top Categories -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Top Categories</h3>
				<div class="h-64 flex items-center justify-center">
					<GraphPieChart />
				</div>
			</div>

			<!-- Recent Activity -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Recent Activity</h3>
				<div class="space-y-4">
					<div class="flex items-center space-x-3">
						<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-primary))"></div>
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">New business registered</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">TechCorp Solutions - 2 hours ago</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-accent))"></div>
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">Product added</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">Wireless Headphones - 4 hours ago</p>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="w-2 h-2 rounded-full" style="background-color: rgb(var(--color-primary))"></div>
						<div>
							<p class="text-sm font-medium" style="color: rgb(var(--color-text))">User registration</p>
							<p class="text-xs" style="color: rgb(var(--color-text))">john.doe@example.com - 6 hours ago</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Quick Actions -->
			<div class="p-6 rounded-xl shadow-lg" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Quick Actions</h3>
				<div class="space-y-3">
					<button class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3"
						style="background-color: rgb(var(--color-primary)); color: white">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Add New Business</span>
					</button>
					<button class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3 border-2"
						style="border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary)); background-color: transparent">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
						</svg>
						<span>Manage Products</span>
					</button>
					<button class="w-full p-3 rounded-lg font-medium transition-colors text-left flex items-center space-x-3 border-2"
						style="border-color: rgb(var(--color-secondary)); color: rgb(var(--color-text)); background-color: transparent">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
						<span>View Analytics</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Products Table -->
		<div class="mt-8">
			<div class="p-6 rounded-xl shadow-lg mb-6" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h3 class="text-xl font-semibold mb-4" style="color: rgb(var(--color-text))">Recent Products</h3>
			</div>
			<AdminPageProductTable />
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['ADMIN'],
})
</script>

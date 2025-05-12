<template>
	<div class="mx-16 my-8">
		<h2 class="text-2xl font-bold mb-6">Vendor Dashboard</h2>
		<!-- KPI Cards Row -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<!-- KPI Card 1 -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
				<p class="text-2xl font-bold mt-2 text-black">1,245</p>
				<p class="text-green-500 text-sm mt-1">↑ 12% from last month</p>
			</div>

			<!-- KPI Card 2 -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-gray-500 text-sm font-medium">Revenue</h3>
				<p class="text-2xl font-bold mt-2 !text-black">$24,560</p>
				<p class="text-green-500 text-sm mt-1">↑ 8% from last month</p>
			</div>

			<!-- KPI Card 3 -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-gray-500 text-sm font-medium">Avg. Rating</h3>
				<p class="text-2xl font-bold mt-2 text-black">4.7</p>
				<p class="text-gray-500 text-sm mt-1">From 128 reviews</p>
			</div>

			<!-- KPI Card 4 -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-gray-500 text-sm font-medium">Pending Orders</h3>
				<p class="text-2xl font-bold mt-2 text-black">24</p>
				<p class="text-red-500 text-sm mt-1">↓ 3 from yesterday</p>
			</div>
		</div>

		<!-- Additional content can go here -->

		<!-- Graph -->
		<div class="w-1/2">
			<div class="flex justify-between">
				<h1>Sales Graph</h1>
				<div class="flex justify-between gap-10 w-3/12">
					<v-date-input
						label="Start Date"
						prepend-icon=""
						variant="outlined"
						persistent-placeholder
					></v-date-input>
					<v-date-input
						label="End Date"
						prepend-icon=""
						variant="outlined"
						persistent-placeholder
					></v-date-input>
				</div>
			</div>
			<GraphLineChart />
		</div>
	</div>
</template>

<script>
definePageMeta({
	role: ['VENDOR'],
	middleware: ['auth-role'],
	layout: 'admin',
})
</script>

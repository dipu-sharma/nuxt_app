<template>
	<div class="p-4">
		<h1 class="text-center font-bold">Admin Page</h1>

		<!-- Grid layout for the graphs with two equal columns -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			<div class="col-span-1 flex justify-center items-center">
				<GraphBarChart />
			</div>
			<div class="col-span-1 flex justify-center items-center">
				<GraphLineChart />
			</div>
			<div class="col-span-1 flex justify-center items-center">
				<GraphPieChart />
			</div>
			<div class="col-span-1 flex justify-center items-center">
				<GraphDoughnutChart />
			</div>
		</div>

		<AdminPageProductTable />
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	middleware: ['auth-role'],
	role: ['admin'],
	layout: 'admin',
})
</script>

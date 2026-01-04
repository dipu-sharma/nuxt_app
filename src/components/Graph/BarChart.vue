<template>
	<div class="chart-container">
		<GraphBaseChart type="bar" :data="chartData" :options="chartOptions" />
	</div>
</template>

<script setup>
const chartData = {
	labels: ['Fashion', 'Electronics', 'Grocery', 'Home', 'Beauty'],
	datasets: [
		{
			label: 'Sales',
			data: [12000, 19000, 3000, 5000, 2000],
			backgroundColor: [
				'rgba(59, 130, 246, 0.8)',
				'rgba(139, 92, 246, 0.8)',
				'rgba(20, 184, 166, 0.8)',
				'rgba(245, 158, 11, 0.8)',
				'rgba(239, 68, 68, 0.8)'
			],
		},
	],
}

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			callbacks: {
				label: function (context) {
					const label = context.dataset.label || ''
					const value = context.raw
					return `${label}: $${value}`
				},
			},
		},
		datalabels: {
			display: true,
			color: '#fff',
			anchor: 'center',
			align: 'center',
			formatter: (value) => {
				if (value === 0 || value === '') {
					return ''
				}
				return `$${value / 1000}k`
			},
		},
	},
	scales: {
		x: {
			grid: {
				display: false, // Disable grid for x-axis
			},
			title: {
				display: true,
				text: 'Category',
			},
		},
		y: {
			beginAtZero: true,
			ticks: {
				callback: (value) => `$${value / 1000}k`,
			},
			grid: {
				display: true, 
			},
			title: {
				display: true,
				text: 'Sales',
			},
		},
	},
}
</script>

<style scoped>
.chart-container {
	width: 100%;
	/* height: 400px; */
	overflow-x: auto;
	/* Enable horizontal scrolling */
}
</style>

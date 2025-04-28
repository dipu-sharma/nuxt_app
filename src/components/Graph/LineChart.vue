<template>
	<BaseChart type="line" :data="chartData" :options="chartOptions" :is_gradient="true" :height="300" />
</template>

<script setup>
import BaseChart from './BaseChart.vue'
const chartData = {
	labels: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	datasets: [
		{
			label: 'Revenue',
			data: [65, 59, 80, 17, 50, 60, 30, 45, 25, 75, 69, 34],
			borderColor: '#ff6384',
			// pointBackgroundColor: '#ff6384',
			// pointRadius: 5,
			// pointStyle: 'circle',
			fill: false,
			tension: 0.4,
			datalabels: {
				labels: {
					title: null,
				},
			},
		},
		{
			label: 'Expenses',
			data: [45, 49, 60, 10, 50, 70, 30, 25, 42, 39, 55, 12],
			// borderColor: '#36a2eb',
			// pointBackgroundColor: '#36a2eb',
			// pointRadius: 5,
			pointStyle: 'circle',
			fill: false,
			tension: 0.4,
			datalabels: {
				labels: {
					title: null,
				},
			},
		},
		{
			label: 'Profit',
			data: [20, 10, 20, 15, 42, 35, 78, 48, 23, 15, 34, 12],
			// borderColor: '#4bc0c0',
			// pointBackgroundColor: '#4bc0c0',
			// pointRadius: 5,
			pointStyle: 'circle',
			fill: false,
			tension: 0.4,
			datalabels: {
				labels: {
					title: null,
				},
			},
		},
	],
}

const chartOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
			labels: {
				boxWidth: 18,
				usePointStyle: false,
				font: {
					family: 'Lexend Deca',
				},
			},
			onClick: (e, legendItem, legend) => {
				alert(`Clicked on label: ${legendItem.text}`)
			},
		},
		datalabels: {
			labels: {
				title: null,
			},
		},
		tooltip: {
			enabled: true,
		},
	},
	scales: {
		x: {
			grid: {
				display: false,
				drawBorder: false,
				drawOnChartArea: true, // Add this
			},
			ticks: {
				display: true,
			},
		},
		y: {
			grid: {
				display: false,
				drawBorder: false,
				drawOnChartArea: true,
			},
			ticks: {
				display: true,
			},
		},
	},
	// animations: {
	// 	tension: {
	// 		duration: 2000,
	// 		easing: 'linear',
	// 		from: 1,
	// 		to: 0,
	// 		loop: true,
	// 	},
	// },
	elements: {
		line: {
			borderWidth: 2,
		},
		point: {
			radius: 1,
		},
	},
}
</script>

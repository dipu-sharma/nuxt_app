<template>
	<div class="chart-container" :style="containerStyle">
		<canvas ref="canvas" @click="onChartClick" class="canvas"></canvas>
	</div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Register plugins
Chart.register(ChartDataLabels, ...registerables)

const props = defineProps({
	type: String,
	data: Object,
	options: Object,
	is_gradient: {
		type: Boolean,
		default: false,
	},
	gradientColors: {
		type: Array,
		default: () => [
			{ top: 'rgba(59, 130, 246, 1)', middle: 'rgba(59, 130, 246, 0.5)', bottom: 'rgba(59, 130, 246, 0.1)' },
			{ top: 'rgba(139, 92, 246, 1)', middle: 'rgba(139, 92, 246, 0.5)', bottom: 'rgba(139, 92, 246, 0.1)' },
			{ top: 'rgba(20, 184, 166, 1)', middle: 'rgba(20, 184, 166, 0.5)', bottom: 'rgba(20, 184, 166, 0.1)' },
		],
	},
	width: {
		type: [String, Number],
		default: '100%',
	},
	height: {
		type: [String, Number],
		default: '40vh',
	},
	aspectRatio: {
		type: Number,
		default: null,
	},
})

const canvas = ref(null)
let chartInstance = null

const containerStyle = computed(() => ({
	position: 'relative',
	width: typeof props.width === 'number' ? `${props.width}px` : props.width,
	height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const createGradient = (ctx, chartArea, colors) => {
	if (!chartArea) return colors.top
	const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
	gradient.addColorStop(0, colors.bottom)
	gradient.addColorStop(0.5, colors.middle)
	gradient.addColorStop(1, colors.top)
	return gradient
}

const prepareDatasets = () => {
	if (props.type !== 'line') return props.data.datasets

	return props.data.datasets?.map((dataset, index) => {
		const colors = props.gradientColors[index] || props.gradientColors[0]
		const baseConfig = {
			...dataset,
			borderColor: colors.top,
			borderWidth: 2,
			tension: 0.4,
		}

		return props.is_gradient
			? {
					...baseConfig,
					backgroundColor: (context) =>
						createGradient(context.chart.ctx, context.chart.chartArea, colors),
					fill: 'origin',
			  }
			: {
					...baseConfig,
					backgroundColor: dataset.backgroundColor || `${colors.top}33`,
					fill: false,
			  }
	})
}

const renderChart = () => {
	if (chartInstance) chartInstance.destroy()

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			tension: {
				duration: 1000,
				easing: 'linear',
				from: 1,
				to: 0,
				loop: true
			}
		},
		plugins: {
			...(props.options?.plugins || {}),
			legend: { 
				position: 'top',
				labels: {
					color: 'rgba(200, 200, 200, 0.9)'
				}
			},
			tooltip: {
				mode: 'index',
				intersect: false,
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				titleFont: { size: 14, weight: 'bold' },
				bodyFont: { size: 12 },
				padding: 10,
				cornerRadius: 4,
				boxPadding: 4,
			 },
		},
		hover: {
			mode: 'nearest',
			intersect: true,
		},
		scales: {
			...(props.options?.scales || {}),
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(200, 200, 200, 0.2)',
					drawBorder: false,
				},
				ticks: {
					color: 'rgba(200, 200, 200, 0.7)',
					padding: 10,
				},
				...(props.options?.scales?.y || {}),
			},
			x: {
				grid: {
					color: 'rgba(200, 200, 200, 0.2)',
					drawBorder: false,
				},
				ticks: {
					color: 'rgba(200, 200, 200, 0.7)',
					padding: 10,
				},
				...(props.options?.scales?.x || {}),
			},
		},
		...props.options,
	}

	if (props.aspectRatio !== null) {
		chartOptions.aspectRatio = props.aspectRatio
	}

	chartInstance = new Chart(canvas.value, {
		type: props.type,
		data: {
			...props.data,
			datasets: prepareDatasets(),
		},
		options: chartOptions,
	})
}

const onChartClick = (event) => {
	if (!chartInstance) return
	const points = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false)
	if (points.length) {
		const label = chartInstance.data.labels[points[0].index]
		const value = chartInstance.data.datasets[points[0].datasetIndex].data[points[0].index]
		alert(`Clicked on ${label}: ${value}`)
	}
}

watch(
	[
		() => props.data,
		() => props.options,
		() => props.gradientColors,
		() => props.is_gradient,
		() => props.width,
		() => props.height,
		() => props.aspectRatio,
	],
	() => renderChart(),
	{ deep: true },
)

onMounted(renderChart)
</script>

<style scoped>
.chart-container {
	position: relative;
}
.chart-container canvas {
	display: block;
	width: 100%;
	height: 100%;
}
</style>

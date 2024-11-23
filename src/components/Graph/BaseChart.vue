<template>
    <div class="chart-container" style="position: relative; height:40vh">
        <canvas ref="canvas" @click="onChartClick"></canvas>
    </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
    type: String,        // 'pie', 'bar', 'line', 'doughnut'
    data: Object,        // Chart.js data object
    options: Object,     // Chart.js options object
})

const canvas = ref(null)
let chartInstance = null

const renderChart = () => {
    if (chartInstance) chartInstance.destroy(); // Destroy previous instance to avoid memory leak

    chartInstance = new Chart(canvas.value, {
        type: props.type,
        data: props.data,
        options: props.options,
    });
};

const onChartClick = (event) => {
    const points = chartInstance.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false)
    if (points.length) {
        const label = chartInstance.data.labels[points[0].index]
        const value = chartInstance.data.datasets[points[0].datasetIndex].data[points[0].index]
        alert(`Clicked on ${label}: ${value}`)
    }
};

onMounted(renderChart);
watch([props.data, props.options], renderChart)
</script>

<style scoped>
canvas {
    width: 100%;
    height: 100%;
}
</style>

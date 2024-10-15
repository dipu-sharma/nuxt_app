<template>
    <BaseChart type="line" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import BaseChart from './BaseChart.vue';

const chartData = {
    labels: ['January', 'February', 'March'],
    datasets: [{
        label: 'Revenue',
        data: [65, 59, 80],
        borderColor: '#ff6384',
        fill: false,
        tension: 0.4 // Add this line for smoothness
    }]
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            onClick: (e, legendItem, legend) => {
                // Custom label click event
                alert(`Clicked on label: ${legendItem.text}`);
            }
        }
    }
};
</script>

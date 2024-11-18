<template>
    <BaseChart type="line" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import BaseChart from './BaseChart.vue';

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
            label: 'Revenue',
            data: [65, 59, 80, 17, 50, 60, 30, 45, 25, 75, 69],
            borderColor: '#ff6384',
            fill: false,
            tension: 0.4 // Smooth line
        },
        {
            label: 'Expenses',
            data: [45, 49, 60, 10,50,70,30,25,42,39],
            borderColor: '#36a2eb',
            fill: false,
            tension: 0.4 // Smooth line
        },
        {
            label: 'Profit',
            data: [20, 10, 20,15,42,35,78,48,23,15],
            borderColor: '#4bc0c0',
            fill: false,
            tension: 0.4 // Smooth line
        }
    ]
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
    },
    scales: {
        x: {
            grid: {
                display: false // Disable grid on the x-axis
            }
        },
        y: {
            grid: {
                display: false // Disable grid on the y-axis
            }
        }
    }
};
</script>

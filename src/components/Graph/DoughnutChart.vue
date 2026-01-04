<template>
    <GraphBaseChart type="doughnut" :data="chartData" :options="chartOptions" />
</template>

<script setup>

const chartData = {
    labels: ['Fashion', 'Electronics', 'Grocery', 'Home', 'Beauty'],
    datasets: [{
        label: 'Product Types',
        data: [300, 50, 100, 40, 120],
        backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(20, 184, 166, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
        ],
        hoverOffset: 4
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

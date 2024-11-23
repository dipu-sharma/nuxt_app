<template>
    <GraphBaseChart type="doughnut" :data="chartData" :options="chartOptions" />
</template>

<script setup>

const chartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
        label: 'My Doughnut Chart',
        data: [200, 150, 100],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
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

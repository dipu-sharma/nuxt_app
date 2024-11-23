<template>
    <GraphBaseChart type="pie" :data="chartData" :options="chartOptions" />
</template>

<script setup>

const chartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
        label: 'My Pie Chart',
        data: [300, 50, 100],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
    }]
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            onClick: (e, legendItem, legend) => {
                // Custom label click event to filter the data
                alert(`Clicked on label: ${legendItem.text}`);
            }
        }
    }
};
</script>

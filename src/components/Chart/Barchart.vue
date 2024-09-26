<template>
  <div class="">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { ref } from 'vue';

// Register necessary chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Data for the chart
const chartData = ref({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: [40, 20, 12, 50, 10],
    },
  ],
});

// Chart options with clickable functionality
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  onClick(event, elements) {
    if (elements.length > 0) {
      // Get the clicked element index
      const elementIndex = elements[0].index;

      // Access the clicked label and value
      const label = chartData.value.labels[elementIndex];
      const value = chartData.value.datasets[0].data[elementIndex];

      // Log or perform any action with the clicked bar data
      alert(`Clicked on ${label}: ${value}`);
    }
  },
});
</script>

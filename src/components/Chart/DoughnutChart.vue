<template>
    <canvas id="doughnutChart"></canvas>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  onMounted(() => {
    const pieConfig = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [33, 33, 33],
            backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
            label: 'Dataset 1',
          },
        ],
        labels: ['Shoes', 'Shirts', 'Bags'],
      },
      options: {
        responsive: true,
        cutout: '80%', // Changed from cutoutPercentage for Chart.js 3.x and above
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  
    const pieCtx = document.getElementById('doughnutChart');
    new Chart(pieCtx, pieConfig);
  });
  </script>
  
  <style scoped>
  /* Add any styles if necessary */
  </style>
  
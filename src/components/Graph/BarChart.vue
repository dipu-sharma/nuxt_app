<template>
    <div class="chart-container">
        <GraphBaseChart type="bar" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);

const chartData = {
    labels: [
        '30 Sep - 7 Oct', '8-14 Oct', '15-21 Oct', '22-28 Oct',
        '29-4 Nov', '5-11 Nov', '12-18 Nov'
    ],
    datasets: [
        {
            label: 'Milestone Planned',
            data: [10, 15, 30, 20, 0, 32, 36],
            backgroundColor: '#ff867c',
            stack: 'Stack 0',
        },
        {
            label: 'Milestone Completed',
            data: [5, 13, 18, 14, 20, 20, 10],
            backgroundColor: '#84e1ce',
            stack: 'Stack 0',
        }
    ]
};

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                boxWidth: 12,
                usePointStyle: true,
            },
            onClick: (e, legendItem, legend) => {
                alert(`Clicked on label: ${legendItem.text}`);
            }
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    const label = context.dataset.label || '';
                    const value = context.raw;
                    return `${label}: ${value}%`;
                }
            }
        },
        datalabels: {
            display: true,
            color: '#000',
            anchor: 'center',
            align: 'center',
            formatter: (value) => {
                if (value === 0 || value === '') {
                    return '';
                }
                return `${value}%`;
            },
        }
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                display: false, // Disable grid for x-axis
            },
            title: {
                display: true,
                text: 'Date',
            }
        },
        y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
                callback: (value) => `${value}%`,
            },
            grid: {
                display: true, // Disable grid for y-axis
            },
            title: {
                display: true,
                text: 'Achievement %',
            }
        }
    }
};
</script>

<style scoped>
.chart-container {
    width: 100%;
    /* height: 400px; */
    overflow-x: auto;
    /* Enable horizontal scrolling */
}
</style>

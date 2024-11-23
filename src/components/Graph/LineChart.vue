<template>
    <GraphBaseChart type="line" :data="chartData" :options="chartOptions" />
</template>

<script setup>

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
        {
            label: 'Revenue',
            data: [65, 59, 80, 17, 50, 60, 30, 45, 25, 75, 69],
            borderColor: '#ff6384',
            pointBackgroundColor: '#ff6384',
            pointRadius: 5,
            pointStyle: 'circle',
            fill: false,
            tension: 0.4 // Smooth line
        },
        {
            label: 'Expenses',
            data: [45, 49, 60, 10, 50, 70, 30, 25, 42, 39],
            borderColor: '#36a2eb',
            pointBackgroundColor: '#36a2eb',
            pointRadius: 5,
            pointStyle: 'circle',
            fill: false,
            tension: 0.4 // Smooth line
        },
        {
            label: 'Profit',
            data: [20, 10, 20, 15, 42, 35, 78, 48, 23, 15],
            borderColor: '#4bc0c0',
            pointBackgroundColor: '#4bc0c0',
            pointRadius: 5,
            pointStyle: 'circle',
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
            labels: {
                boxWidth: 18,
                usePointStyle: true,
                font: {
                    family: 'Lexend Deca',
                },
            },
            onClick: (e, legendItem, legend) => {
                // Custom label click event
                alert(`Clicked on label: ${legendItem.text}`);
            }
        },
        datalabels: {
            display: false,
            color: '#000',
            anchor: 'center',
            align: 'center',
            formatter: (value) => `${value}%`,
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
    },
    animations: {
        tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true
        }
    },
    // animation: {
    //     duration: 1000,
    //     easing: 'easeOutBounce',
    //     onProgress: function (animation) {

    //     },
    //     onComplete: function () {
    //         // Custom logic to be executed after animation completes
    //         console.log('Animation complete!');
    //     }
    // }
};
</script>

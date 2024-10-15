<template>
  <div class="mt-5">
    <h1 class="text-center font-bold">Admin Page</h1>

    <!-- Grid layout for the graphs with two equal columns -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="col-span-1">
        <GraphBarChart />
      </div>
      <div class="col-span-1">
        <GraphLineChart />
      </div>
      <div class="col-span-1">
        <GraphPieChart />
      </div>
      <div class="col-span-1">
        <GraphDoughnutChart />
      </div>
    </div>

    <AdminPageProductTable />
  </div>
</template>

<script>
definePageMeta({
  layout: 'admin' // Use the 'admin' layout created above
})
</script>

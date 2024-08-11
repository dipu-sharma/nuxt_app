<template>
    <div>
        <h1 class="text-center font-bold">{{ category }} Products </h1>
    </div>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-2 bg-white ml-2 mr-2 shadow-lg rounded-md">
            <h2 class="text-center">{{ category }}</h2>
        </div>
        <div class="col-span-10 bg-white ml-2 mr-2 shadow-lg rounded-md">
            <h2 class="text-center">{{category}}Product</h2>
        </div>
    </div>
    <div class="text-center justify-center mt-5">
        <Watch/>
        <WatchCompute/>
        <Onmounted/>
        <!-- <TableLoad/> -->
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const category = route.params.category;
</script>
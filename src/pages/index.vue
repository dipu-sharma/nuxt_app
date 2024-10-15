<template>
    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Carousels />
        <div class=" bg-black px-10 py-2 mx-20 border rounded-lg">
            <h1 class="">All Category</h1>
        </div>
        <Product />
    </div>
</template>

<script setup>
const value = ref(10);
const items = ref([
    { title: 'Slide 1', src: 'https://via.placeholder.com/800x400.png?text=Slide+1' },
    { title: 'Slide 2', src: 'https://via.placeholder.com/800x400.png?text=Slide+2' },
    { title: 'Slide 3', src: 'https://via.placeholder.com/800x400.png?text=Slide+3' },
]);
</script>
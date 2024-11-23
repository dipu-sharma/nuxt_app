<template>
    <div class="">
        <!-- <Carousels /> -->
        <div class="px-10 py-2 mx-20 text-black">
            <h1 class="">All Category</h1>
        </div>
        <Product />
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Login',
    description: 'Learn more about our company',
    layout: 'default'
})
const items = ref([
    { title: 'Slide 1', src: 'https://via.placeholder.com/800x400.png?text=Slide+1' },
    { title: 'Slide 2', src: 'https://via.placeholder.com/800x400.png?text=Slide+2' },
    { title: 'Slide 3', src: 'https://via.placeholder.com/800x400.png?text=Slide+3' },
]);
</script>
<template>
    <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800" >
        <v-container>
            <div class="mx-10">
                <v-carousel cycle :interval="5000"
                    class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg">
                    <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.src" class="relative">
                        <v-row class="fill-height" align="center" justify="center">
                            <v-col class="text-center">
                                <h1 class="text-white text-3xl font-bold">{{ item.title }}</h1>
                            </v-col>
                        </v-row>
                        <!-- Overlay for gradient effect -->
                        <div class="absolute inset-0 bg-gradient-to-t via-transparent to-transparent"></div>
                    </v-carousel-item>
                </v-carousel>
            </div>
        </v-container>
        <hr />
        <v-container class="mx-20">
            <v-slider v-model="value" :min="0" :max="100" label="Volume"></v-slider>
            <h1>{{ value }}</h1>
        </v-container>
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
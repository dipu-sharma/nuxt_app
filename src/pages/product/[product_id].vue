<template>
    <div>
        <h1 class="text-center">{{ product_id }} Details</h1>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const product_id = route.params.product_id;
</script>
<template>
    <div v-if="product">
        <h1 class="text-center">{{ product.name }} Details</h1>
        <p>Description: {{ product.description }}</p>
        <p>Price: {{ product.price }}</p>
        <!-- Add more product details here as needed -->
    </div>
    <div v-else>
        <p>Loading product details...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useApiCall from '~/composables/useApiCall';

const route = useRoute();
const product_id = route.params.product_id;
const product = ref(null);
const { callApi } = useApiCall();

onMounted(async () => {
    try {
        const response = await callApi('get', `/home/products/${product_id}`);
        product.value = response.product; // Assuming the API returns a 'product' object
    } catch (error) {
        console.error('Error fetching product details:', error);
        // Handle error, e.g., show a message to the user
    }
});
</script>
<template>
	<div>
		<!-- <label>Product Name</label> -->
		<v-text-field variant="outlined" v-model="payload.product_name" label="Enter Product Name" />
	</div>
</template>
<script setup>
const props = defineProps({
	payload: Object,
})
</script>

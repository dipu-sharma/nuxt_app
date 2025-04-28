<template>
	<div>
		<h2>Orders Table</h2>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Orders',
	description: 'List of orders',
	middleware: ['auth-role'],
	role: ['vendor'],
	layout: 'admin',
})
</script>

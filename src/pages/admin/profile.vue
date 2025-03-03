<template>
	<div>
		<h4 class="text-2xl text-center">Admin Page</h4>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	middleware: ['auth-role'],
	role: ['admin'],
	layout: 'admin',
})
</script>

<style scoped></style>

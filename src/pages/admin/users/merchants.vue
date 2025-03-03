<template>
	<div>
		<h2 class="text-center font-bold pt-5">Merchants Page</h2>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['admin'],
})
</script>
<style scoped></style>

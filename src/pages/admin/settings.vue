<template>
	<div class="mt-5">
		<h1 class="text-center font-bold">Admin Settings Page</h1>
		<a href="http://localhost:3002/verify?id=xyzedfs&verify=true">Click Me</a>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Settings',
	description: 'Learn more about our company',
	middleware: ['auth-role'],
	role: ['admin'],
	layout: 'admin',
})
</script>

<template>
	<div>
		<h3>Employee List</h3>
	</div>
</template>
<script setup>
definePageMeta({
	title: 'Employees',
	description: 'List of employees',
	middleware: ['auth-role'],
	role: ['vendor'],
	layout: 'admin',
})
</script>

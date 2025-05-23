<template>
	<div>
		<h2>Orders Table</h2>
		<button type="button" @click="handleCookieSet">Set Cookie</button>
		<button type="button" @click="handleCookieGet">Get Cookie</button>
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

const handleCookieSet = async () => {
	const { set_cookie } = authApi()
	const res = set_cookie()
}

const handleCookieGet = async () => {
	const { get_cookie } = authApi()
	const res = await get_cookie()
	console.log('Response___________________________', res)
}
</script>

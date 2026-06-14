<template>
	<div class="p-6">
		<h2>Orders Table</h2>
		<button type="button" @click="handleCookieSet">Set Cookie</button>
		<button type="button" @click="handleCookieGet">Get Cookie</button>
	</div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

definePageMeta({
	title: 'Orders',
	description: 'List of orders',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
	layout: 'admin',
})

const { setCookie, getCookie } = useAuth()

const handleCookieSet = async () => {
	await setCookie()
}

const handleCookieGet = async () => {
	const res = await getCookie()
	console.log('Response___________________________', res)
}
</script>

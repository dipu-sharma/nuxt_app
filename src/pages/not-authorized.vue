<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<h1>Not Authorized</h1>
		<p>You do not have permission to access this page.</p>
		<NuxtLink to="/">Go back to Home</NuxtLink>
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()

const { role } = storeToRefs(authStore)

onMounted(() => {
	if (!authStore.isAuthenticated) {
		navigateTo('/login')
	} else {
		if (role.value !== 'superadmin') {
			navigateTo('/not-authorized')
		}
	}
})
</script>

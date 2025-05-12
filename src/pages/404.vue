<template>
	<div class="flex flex-col justify-center items-center min-h-screen shadow-sm">
		<div class="px-24 py-16 bg-white rounded-lg shadow-md text-center">
			<h3 class="text-2xl font-bold mb-6">Access Denied 404</h3>
			<div class="flex justify-center">
				<button
					@click="handleBack"
					class="px-6 py-2 bg-orange-400 hover:bg-orange-500 rounded-lg text-white transition-colors"
				>
					Go Home
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const authStore = useAuthStore()
const router = useRouter()
definePageMeta({
	layout: 'login',
})

const handleBack = () => {
	authStore.doLogout()
	router.push('/login')
}
</script>

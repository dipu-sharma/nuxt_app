<template>
	<div class="flex items-center justify-center h-screen">
		<div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify'

import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { ssoLogin, getMe } = useAuth()

onMounted(async () => {
	const { code, state } = route.query
	const provider = route.params.provider as string

	if (code && provider) {
		try {
			const response = await ssoLogin(provider, code as string, state as string)
			authStore.setLoginData(response)
			const response_user = await getMe()
			authStore.addUser(response_user.data)
			if (response?.data?.access_token) {
				toast.success('Logged in Successfully', {
					position: 'top-right',
					autoClose: 3000,
					limit: 1,
				})
				redirectToRole(response?.data?.role)
			} else {
				toast.error('Invalid Credentials', {
					position: 'top-right',
					autoClose: 3000,
					limit: 1,
				})
				router.push('/login')
			}
		} catch (error) {
			toast.error('SSO Login Failed', {
				position: 'top-right',
				autoClose: 3000,
				limit: 1,
			})
			router.push('/login')
		}
	} else {
		router.push('/login')
	}
})

const redirectToRole = (userType) => {
	const UserType = {
		ADMIN: 'ADMIN',
		BUSINESS_OWNER: 'BUSINESS_OWNER',
		BUSINESS_MEMBER: 'BUSINESS_MEMBER',
		USER: 'USER',
	}
	switch (userType) {
		case UserType.ADMIN:
			router.push('/admin')
			break
		case UserType.BUSINESS_OWNER:
			router.push('/business')
			break
		case UserType.BUSINESS_MEMBER:
			router.push('/business')
			break
		default:
			router.push('/user')
			break
	}
}
</script>

<style scoped>
.loader {
	border-top-color: #3498db;
	animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>

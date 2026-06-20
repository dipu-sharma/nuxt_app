<template>
	<v-app>
		<Sidebar />
		<div class="flex flex-col flex-1 w-full">
			<Topbar />
			<v-main>
				<div class="h-full pb-16 overflow-y-auto" style="color: rgb(var(--color-text))">
					<slot />
				</div>
			</v-main>
			<AutoLogOut />
			<FiltersRightSidebarFilter />
		</div>
	</v-app>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAutoLogout } from '~/composables/autoLogout'

const authStore = useAuthStore()
const { startTimer, stopTimer } = useAutoLogout()

const isDesktop = ref(false)

const updateIsDesktop = () => {
	isDesktop.value = window.innerWidth >= 1024
}

watch(
	() => authStore.isAuthenticated,
	(isLoggedIn) => {
		if (isLoggedIn) {
			startTimer()
		} else {
			stopTimer()
		}
	},
)

onMounted(async () => {
	updateIsDesktop()
	window.addEventListener('resize', updateIsDesktop)

	if (['BUSINESS_OWNER', 'BUSINESS_MEMBER'].includes(authStore.role) && !authStore.user?.business_id) {
		try {
			const { getProfile } = useBusinessProfile()
			const res = await getProfile()
			if (res?.data?.business_id) {
				const userObj = { ...authStore.user, business_id: res.data.business_id }
				authStore.addUser(userObj)
			}
		} catch (e) {
			console.error('Failed to prefetch business profile in layout:', e)
		}
	}
})

onUnmounted(() => {
	window.removeEventListener('resize', updateIsDesktop)
})
</script>

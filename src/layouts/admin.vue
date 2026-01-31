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

onMounted(() => {
	updateIsDesktop()
	window.addEventListener('resize', updateIsDesktop)
})

onUnmounted(() => {
	window.removeEventListener('resize', updateIsDesktop)
})
</script>

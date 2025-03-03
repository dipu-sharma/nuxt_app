<template>
	<div class="flex h-screen">
		<SideBar v-if="isDesktop" />
		<div class="flex flex-col flex-1 w-full">
			<!-- Topbar -->
			<Topbar />
			<!-- Main page content -->
			<main class="h-full pb-16 overflow-y-auto">
				<div
					class="p-6"
					:class="{
						'bg-gray-700 text-white': themeStore.theme === 'light',
						'bg-gray-200 text-black': themeStore.theme === 'dark',
					}"
				>
					<slot />
				</div>
			</main>
			<AutoLogOut />
		</div>
	</div>
</template>

<script setup>
import SideBar from '~/components/AdminPage/Sidebar.vue'
import Topbar from '~/components/AdminPage/Topbar.vue'
import { useAuthStore } from '~/stores/auth'
import { useAutoLogout } from '~/composables/autoLogout'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const is_theme = ref('')
const { startTimer, stopTimer } = useAutoLogout()

const isDesktop = ref(false)

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
	const updateIsDesktop = () => {
		isDesktop.value = window.innerWidth >= 1024
	}
	updateIsDesktop()
	window.addEventListener('resize', updateIsDesktop)

	onUnmounted(() => {
		window.removeEventListener('resize', updateIsDesktop)
	})

	is_theme.value = localStorage.getItem('theme')
})
</script>

<style scoped>
/* Custom styles (optional) */
</style>

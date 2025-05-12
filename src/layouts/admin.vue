<template>
	<div class="flex h-screen">
		<Sidebar v-if="isDesktop" />
		<div class="flex flex-col flex-1 w-full">
			<Topbar />
			<main
				class="h-full pb-16 overflow-y-auto px-8"
				:class="{
					'bg-gray-700 text-white': themeStore.theme === 'light',
					'bg-gray-200 text-black': themeStore.theme === 'dark',
				}"
			>
				<slot />
			</main>
			<AutoLogOut />
		</div>
	</div>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAutoLogout } from '~/composables/autoLogout'
import { useThemeStore } from '~/stores/themeStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const is_theme = ref('')
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

	is_theme.value = localStorage.getItem('theme')
})

onUnmounted(() => {
	window.removeEventListener('resize', updateIsDesktop)
})
</script>

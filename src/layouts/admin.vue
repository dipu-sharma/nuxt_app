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

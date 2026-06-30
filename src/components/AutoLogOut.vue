<template>
    <ClientOnly>
        <div>
            <div
                v-if="isLoggedIn && !isModalVisible"
                class="fixed bottom-4 right-4 bg-gray-100 px-4 py-2 rounded shadow-md z-50"
                :class="{
                    'bg-gray-700 text-white': themeStore.theme === 'light',
                    'bg-gray-200 text-black': themeStore.theme === 'dark',
                }"
            >
                <p class="text-sm font-bold">Auto-logout in: {{ formattedTime }}</p>
            </div>
            <Dialog
                v-model="isModalVisible"
                title="Session Timeout"
                :show-button="false"
                max-width="500px"
            >
                <template #content>
                    <div class="text-center">
                        <p class="text-lg">Your session is about to expire.</p>
                        <p class="text-4xl font-bold my-4">{{ formattedTime }}</p>
                        <p>To protect your account, you will be logged out automatically.</p>
                    </div>
                </template>
                <template #actions>
                    <div class="flex justify-center gap-4 mt-4">
                        <v-btn color="primary" @click="resetTimer">Stay Logged In</v-btn>
                        <v-btn color="error" @click="logoutNow">Log Out Now</v-btn>
                    </div>
                </template>
            </Dialog>
        </div>
    </ClientOnly>
</template>

<script setup>
import { useAutoLogout } from '~/composables/autoLogout'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'

const { remainingTime, startTimer, stopTimer, isModalVisible, resetTimer } = useAutoLogout()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)

const formattedTime = computed(() => {
	const minutes = Math.floor(remainingTime.value / 60)
	const seconds = remainingTime.value % 60
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const logoutNow = () => {
    stopTimer();
    authStore.doLogout();
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
	{ immediate: true },
)
</script>

<style scoped>
/* Add any styles you need */
</style>

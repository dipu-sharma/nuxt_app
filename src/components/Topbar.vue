<template>
	<div style="background-color: rgb(var(--color-sidebar)); color: rgb(var(--color-sidebar-text))">
		<header class="z-10 py-4 shadow-md" style="background-color: rgb(var(--color-sidebar)); border-bottom: 1px solid rgb(var(--color-border))">
			<div
				class="container flex items-center justify-between h-full px-6 mx-auto text-primary"
			>
				<!-- Mobile hamburger -->
				<button
					type="button"
					class="z-10 p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
					aria-label="Menu"
					@click="toggleMenu"
				>
					<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>

				<!-- Page Title (Left Side) -->
				<div class="hidden md:block">
					<h2 class="text-lg font-bold truncate max-w-[200px] lg:max-w-md">
						{{ displayTitle }}
					</h2>
				</div>

				<!-- Search input -->
				<div class="flex justify-center flex-1 lg:mr-32">
					<div class="relative w-full max-w-xl mr-7 focus-within:text-primary"></div>
				</div>
				<ul class="flex items-center flex-shrink-0 space-x-6">
					<!-- Theme toggler -->
					<li class="flex">
						<button
							class="rounded-md focus:outline-none focus:shadow-outline-purple p-2"
							@click="themeStore.toggleTheme()"
							:aria-label="`Switch to ${getNextThemeName()} theme`"
						>
							<!-- Current theme indicator -->
							<div class="flex items-center space-x-1">
								<!-- Theme icon based on current theme -->
								<template v-if="themeStore.currentTheme === 'light'">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
									</svg>
								</template>
								<template v-else-if="themeStore.currentTheme === 'dark'">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
									</svg>
								</template>
								<template v-else-if="themeStore.currentTheme === 'sepia'">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								</template>
								<template v-else-if="themeStore.currentTheme === 'blue'">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clip-rule="evenodd"></path>
									</svg>
								</template>
								<template v-else-if="themeStore.currentTheme === 'green'">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
								</template>
								<!-- Theme name -->
								<span class="text-xs ml-1 capitalize">{{ themeStore.currentTheme }}</span>
							</div>
						</button>
					</li>
					<!-- Notifications menu -->
					<li class="relative">
						<button
							class="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
							@click="toggleNotificationsMenu"
							@keydown.escape="closeNotificationsMenu"
							aria-label="Notifications"
							aria-haspopup="true"
						>
							<svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
								></path>
							</svg>
							<!-- Notification badge -->
							<span
								aria-hidden="true"
								class="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-accent border-2 border-background rounded-full"
							></span>
						</v-btn>
					</template>
					<v-list>
						<v-list-item>
							<v-list-item-title>Messages</v-list-item-title>
							<v-list-item-title class="ml-auto">13</v-list-item-title>
						</v-list-item>
						<v-list-item>
							<v-list-item-title>Sales</v-list-item-title>
							<v-list-item-title class="ml-auto">2</v-list-item-title>
						</v-list-item>
						<v-list-item>
							<v-list-item-title>Alerts</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
				<!-- Profile menu -->
				<v-menu offset-y>
					<template v-slot:activator="{ props }">
						<v-btn icon v-bind="props">
							<v-avatar size="32">
								<img
									class="object-cover w-8 h-8 rounded-full"
									src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&h=128&q=80"
									alt=""
									aria-hidden="true"
								/>
							</v-avatar>
						</v-btn>
					</template>
					<v-list>
						<v-list-item to="/admin/profile">
							<v-list-item-title>Profile</v-list-item-title>
						</v-list-item>
						<v-list-item @click="logout">
							<v-list-item-title>Log out</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</ul>
		</div>
	</v-app-bar>
</template>
<script setup>
import { toast } from 'vue3-toastify'
import { useNavStore } from '~/stores/navStore'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'
import { ref } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const navStore = useNavStore()
const themeStore = useThemeStore()

const isNotificationsMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const displayTitle = computed(() => {
	const role = authStore.role || ''
	const title = route.meta.title || 'Dashboard'

	// Format role: ADMIN -> Admin, BUSINESS_OWNER -> Business Owner
	const formattedRole = role
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')

	if (!formattedRole) return title

	// If title already starts with the role, don't duplicate
	if (title.toLowerCase().startsWith(formattedRole.toLowerCase())) {
		return title
	}

	return `${formattedRole} ${title}`
})

const toggleMenu = () => {
	navStore.toggleMobileSideMenu()
}

const getNextThemeName = () => {
	const currentIndex = themeStore.themes.indexOf(themeStore.currentTheme)
	const nextIndex = (currentIndex + 1) % themeStore.themes.length
	return themeStore.themes[nextIndex]
}

const logout = () => {
	try {
		authStore.doLogout()
		toast.success('You have been logged out successfully.', {
			position: 'top-right',
			autoClose: 3000,
		})
	} catch (error) {
		console.error('An error occurred during logout:', error)
		toast.error('An error occurred during logout.', {
			position: 'top-right',
			autoClose: 3000,
		})
	}
}
</script>
<style>
/* Add any custom styles here if needed */
</style>

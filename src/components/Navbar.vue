<template>
	<header>
		<nav
			class="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between w-full py-3 md:py-0 px-4 text-lg shadow-md z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-colors duration-300">
			<div class="md:p-4">
				<NuxtLink to="/"
					class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 tracking-tight">
					D-Shop </NuxtLink>
			</div>

			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer md:hidden block text-text" fill="none"
				viewBox="0 0 24 24" stroke="currentColor" aria-label="Toggle menu" @click="toggleMenu">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>

			<div class="w-full flex justify-center items-center md:flex md:items-center md:w-auto transition-all"
				:class="{ hidden: !isMenuOpen }">
				<ul class="pt-4 text-base md:flex md:justify-between md:pt-0 items-center gap-2">
					<li>
						<NuxtLink
							class="md:p-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/">Home</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:p-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=electronic">Electronic</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:p-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=fashion">Fashion</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:p-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=grocery">Grocery</NuxtLink>
					</li>
					<li class="p-4 cursor-pointer hover:scale-110 transition-transform"
						@click="themeStore.toggleTheme()">
						<Icon :name="themeStore.currentTheme === 'light' ? 'ri:moon-line' : 'ri:sun-line'"
							class="text-primary w-5 h-5" />
					</li>
					<li v-if="!authStore.isAuthenticated">
						<NuxtLink
							class="md:px-5 md:py-2 py-2 block font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
							:to="{ name: 'login' }">Sign In</NuxtLink>
					</li>

					<li v-else class="relative z-[100]" ref="dropdownRef">
						<button @click="toggleDropdown"
							class="md:p-4 py-2 flex items-center gap-1 font-medium text-text/70 hover:text-primary transition-colors focus:outline-none">
							<Icon name="mdi:account-circle-outline" class="w-5 h-5" />
							<span>Profile</span>
							<Icon name="mdi:chevron-down" class="w-4 h-4 opacity-50" />
						</button>
						<div v-if="isDropdownOpen"
							class="absolute z-[1000] right-0 mt-2 md:mr-0 w-56 bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-[100] overflow-hidden animate-fade-in-up py-2"
							style="animation-duration: 0.2s;">
							<div class="px-4 py-3 border-b border-border/50 mb-2">
								<p class="text-sm font-bold text-text">My Account</p>
							</div>
							<NuxtLink to="/user"
								class="block px-4 py-2.5 text-sm text-text/80 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
								<Icon name="mdi:account-outline" class="w-4 h-4" /> Account Settings
							</NuxtLink>
							<NuxtLink to="/user/cart"
								class="block px-4 py-2.5 text-sm text-text/80 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
								<Icon name="mdi:cart-outline" class="w-4 h-4" /> Shopping Cart
							</NuxtLink>
							<NuxtLink to="/user/order"
								class="block px-4 py-2.5 text-sm text-text/80 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
								<Icon name="mdi:package-variant" class="w-4 h-4" /> My Orders
							</NuxtLink>
							<div class="h-px bg-border/50 my-2"></div>
							<button @click="logout"
								class="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3 font-medium">
								<Icon name="mdi:logout" class="w-4 h-4" /> Logout
							</button>
						</div>
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value
}

function toggleDropdown() {
	isDropdownOpen.value = !isDropdownOpen.value
}

const logout = () => {
	authStore.doLogout()
	navigateTo('/login')
}

const handleClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isDropdownOpen.value = false
	}
}

onMounted(() => {
	if (process.client) {
		document.addEventListener('click', handleClickOutside)
	}
})

onUnmounted(() => {
	if (process.client) {
		document.removeEventListener('click', handleClickOutside)
	}
})
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>

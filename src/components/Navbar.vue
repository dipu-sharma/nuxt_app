<template>
	<header>
		<nav
			class="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between w-full py-3 md:py-1 px-4 text-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] z-50 bg-background/40 backdrop-blur-2xl border-b border-border/30 transition-colors duration-500">
			<div class="md:py-2 md:px-4">
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
							class="md:py-2 md:px-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/">Home</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:py-2 md:px-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=electronic">Electronic</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:py-2 md:px-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=fashion">Fashion</NuxtLink>
					</li>
					<li>
						<NuxtLink
							class="md:py-2 md:px-4 py-2 block text-text/70 hover:text-primary hover:-translate-y-0.5 transition-all font-medium"
							to="/products?category=grocery">Grocery</NuxtLink>
					</li>
					<!-- Theme Toggle -->
					<li class="py-2 px-4 cursor-pointer hover:scale-110 transition-transform relative group"
						@click="themeStore.toggleTheme()" :title="'Current theme: ' + themeStore.currentTheme">
						<ClientOnly>
							<Icon :name="themeIcon" class="text-primary w-5 h-5" />
							<span
								class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-text text-background px-2 py-1 rounded shadow pointer-events-none capitalize">
								{{ themeStore.currentTheme }}
							</span>
							<template #fallback>
								<Icon name="ri:sun-line" class="text-primary w-5 h-5 opacity-50" />
							</template>
						</ClientOnly>
					</li>
					<!-- Cart Icon -->
					<ClientOnly>
						<li v-if="!authStore.role || authStore.role?.toUpperCase() === 'USER'"
							class="relative py-1 px-4 flex items-center">
							<NuxtLink to="/user/cart"
								class="relative text-text/70 hover:text-primary transition-colors focus:outline-none"
								aria-label="Cart">
								<Icon name="mdi:cart-outline" class="w-6 h-6" />
								<span v-if="cartStore.totalItems > 0"
									class="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-5 text-[11px] font-bold text-white bg-primary border-2 border-background rounded-full"
									style="transform: translate(30%, -30%)">
									{{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
								</span>
							</NuxtLink>
						</li>
						<template #fallback>
							<li class="relative py-2 px-4 flex items-center">
								<NuxtLink to="/user/cart"
									class="relative text-text/70 hover:text-primary transition-colors focus:outline-none"
									aria-label="Cart">
									<Icon name="mdi:cart-outline" class="w-6 h-6 opacity-50" />
								</NuxtLink>
							</li>
						</template>
					</ClientOnly>
					<ClientOnly>
						<li v-if="!authStore.isAuthenticated">
							<NuxtLink
								class="md:py-2 md:px-5 py-2 block font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
								:to="{ name: 'login' }">Sign In</NuxtLink>
						</li>

						<li v-else class="relative z-[100]" ref="dropdownRef">
							<button @click="toggleDropdown"
								class="md:py-2 md:px-4 py-2 flex items-center gap-1 font-medium text-text/70 hover:text-primary transition-colors focus:outline-none">
								<Icon name="mdi:account-circle-outline" class="w-5 h-5" />
								<span>Profile</span>
								<Icon name="mdi:chevron-down" class="w-4 h-4 opacity-50" />
							</button>
							<div v-if="isDropdownOpen"
								class="absolute z-[1000] left-0 right-0 mx-auto md:left-auto md:right-0 md:mx-0 mt-2 md:mr-0 w-56 bg-card/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-fade-in-up py-2"
								style="animation-duration: 0.2s;">
								<div class="px-4 py-3 border-b border-border/50 mb-2">
									<p class="text-sm font-bold text-text">My Account</p>
								</div>
								<NuxtLink to="/user"
									class="block px-4 py-2.5 text-sm text-text/80 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3">
									<Icon name="mdi:account-outline" class="w-4 h-4" /> Account Settings
								</NuxtLink>

								<NuxtLink to="/user?tab=orders"
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
						<template #fallback>
							<li>
								<div class="w-24 h-10 rounded-full bg-secondary/50 animate-pulse"></div>
							</li>
						</template>
					</ClientOnly>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'
import { useCartStore } from '~/stores/cartStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

const themeIcon = computed(() => {
	switch (themeStore.currentTheme) {
		case 'light': return 'ri:sun-line'
		case 'dark': return 'ri:moon-line'
		case 'sepia': return 'ri:cup-line'
		case 'blue': return 'ri:drop-line'
		case 'green': return 'ri:leaf-line'
		case 'coolBlue': return 'ri:snowy-line'
		case 'glassmorphism': return 'ri:magic-line'
		case 'claymorphism': return 'ri:shape-2-line'
		case 'neomorphism': return 'ri:focus-3-line'
		default: return 'ri:sun-line'
	}
})

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
	// Fetch Cart
	if (!authStore.role || authStore.role?.toUpperCase() === 'USER') {
		cartStore.fetchCart()
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

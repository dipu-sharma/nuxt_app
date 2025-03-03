<template>
	<header>
		<nav
			class="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-between w-full py-3 md:py-0 px-4 text-lg text-gray-700 bg-white shadow-md z-50"
		>
			<div>
				<NuxtLink to="/" class="h2 w-6 text-black font-bold"> D-Shop </NuxtLink>
			</div>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 cursor-pointer md:hidden block"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-label="Toggle menu"
				@click="toggleMenu"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>

			<div
				class="w-full flex justify-center items-center md:flex md:items-center md:w-auto"
				:class="{ hidden: !isMenuOpen }"
			>
				<ul class="pt-0 text-base text-gray-700 md:flex md:justify-between md:pt-0">
					<li>
						<NuxtLink class="md:p-4 py-2 block hover:text-purple-400" to="/">Home</NuxtLink>
					</li>
					<li>
						<NuxtLink class="md:p-4 py-2 block hover:text-purple-400" to="/product/electronic"
							>Electronic</NuxtLink
						>
					</li>
					<li>
						<NuxtLink class="md:p-4 py-2 block hover:text-purple-400" to="/product/fashion"
							>Fashion</NuxtLink
						>
					</li>
					<li>
						<NuxtLink class="md:p-4 py-2 block hover:text-purple-400" to="/product/grocery"
							>Grocery</NuxtLink
						>
					</li>
					<li class="p-4" @click="toggleTheme">
						<Icon
							:name="themeStore.theme === 'light' ? 'ri:moon-line' : 'ri:sun-line'"
							class="text-purple-500"
						/>
					</li>
					<li v-if="!authStore.getData().isAuthenticated">
						<NuxtLink
							class="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
							:to="{ name: 'login' }"
							>Sign In</NuxtLink
						>
					</li>

					<li v-else>
						<button
							@click="toggleDropdown"
							class="md:p-4 py-2 block hover:text-purple-400 text-purple-500 focus:outline-none"
						>
							Profile
						</button>
						<div
							v-if="isDropdownOpen"
							class="absolute right-0 mt-2 mr-12 md:mr-6 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
						>
							<NuxtLink to="/user" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
								Account
							</NuxtLink>
							<NuxtLink to="/user/cart" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
								Cart
							</NuxtLink>
							<NuxtLink to="/user/order" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
								Order
							</NuxtLink>
							<button
								@click="logout"
								class="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
							>
								Logout
							</button>
						</div>
					</li>
				</ul>
			</div>
		</nav>
	</header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/themeStore'
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value
}

function toggleDropdown() {
	isDropdownOpen.value = !isDropdownOpen.value
}

const toggleTheme = () => {
	themeStore.theme = themeStore.theme === 'light' ? 'dark' : 'light'
	themeStore.addTheme(themeStore.theme)
}

const logout = () => {
	authStore.$ResetAuth()
	navigateTo('/login')
}
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>

<template>
	<aside :class="['z-20 flex-shrink-0 hidden w-64 overflow-y-auto md:block', themeStore.theme]">
		<div :class="['py-4 text-gray-500', themeStore.theme]">
			<div class="py-2 px-8">
				<h1 class="items-center text-xl text-bold justify-center">Admin Dashboard</h1>
			</div>
			<ul class="mt-6">
				<li class="relative px-6 py-3" v-for="(item, index) in sidebarItems" :key="index">
					<NuxtLink
						class="inline-flex text-center items-center w-full text-sm font-semibold"
						:to="item.path"
						:class="{
							'p-2 rounded-lg text-center items-center': isActive(item.path),
							'bg-black text-white': themeStore.theme === 'light' && isActive(item.path),
							'bg-white text-black': themeStore.theme === 'dark' && isActive(item.path),
						}"
					>
						<svg
							class="w-5 h-5"
							aria-hidden="true"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path :d="item.iconPath" />
						</svg>
						<span class="ml-4">{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
			<ul class="">
				<li class="relative px-6 py-3">
					<button
						class="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
						@click="toggleUsersMenu"
					>
						<span class="inline-flex items-center">
							<svg
								class="w-5 h-5"
								aria-hidden="true"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									d="M3 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM4 21a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"
								></path>
							</svg>
							<span class="ml-4">Users</span>
						</span>
						<svg
							v-if="isMobileUsersMenuOpen"
							class="w-4 h-4"
							aria-hidden="true"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M19 9l-7 7-7-7"></path>
							12
						</svg>
						<svg
							v-if="!isMobileUsersMenuOpen"
							class="w-4 h-4"
							aria-hidden="true"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path stroke="none" d="M0 0h24v24H0z" />
							<polyline points="9 6 15 12 9 18" />
						</svg>
					</button>
					<div v-if="isUsersMenuOpen" class="ml-8">
						<ul class="mt-2 space-y-2">
							<li>
								<NuxtLink
									to="/admin/users/"
									class="inline-flex items-center w-full text-sm font-semibold p-2"
									:class="{
										'rounded-md p-2': isActive('/admin/users/'),
										'text-white bg-black':
											themeStore.theme === 'light' && isActive('/admin/users/'),
										'text-black bg-white':
											themeStore.theme === 'dark' && isActive('/admin/users/'),
									}"
								>
									User
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/admin/users/doss"
									class="inline-flex items-center w-full text-sm font-semibold p-2"
									:class="{
										'rounded-md p-2': isActive('/admin/users/doss'),
										'text-white bg-black':
											themeStore.theme === 'light' && isActive('/admin/users/doss'),
										'text-black bg-white':
											themeStore.theme === 'dark' && isActive('/admin/users/doss'),
									}"
								>
									Doss
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/admin/users/merchants"
									class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 p-2"
									:class="{
										'rounded-md p-2': isActive('/admin/users/merchants'),
										'text-white bg-black':
											themeStore.theme === 'light' && isActive('/admin/users/merchants'),
										'text-black bg-white':
											themeStore.theme === 'dark' && isActive('/admin/users/merchants'),
									}"
								>
									Merchants
								</NuxtLink>
							</li>
						</ul>
					</div>
					<ul v-if="navStore.isSideMenuOpen" class="mt-2 space-y-3 text-center items-center">
						<li
							v-for="(item, index) in usersMenuItems"
							:key="index"
							:class="['relative px-6 py-3 items-center', { active: activeIndex === index }]"
						>
							<NuxtLink
								class="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
								:to="item.path"
								@click="activeIndex = index"
							>
								<span class="ml-4">{{ item.label }}</span>
							</NuxtLink>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useNavStore } from '~/stores/navStore'
import { useThemeStore } from '~/stores/themeStore'
const navStore = useNavStore()
const themeStore = useThemeStore()
const is_theme = ref('')
const isUsersMenuOpen = ref(false)
const isMobileUsersMenuOpen = ref(false)
const activeIndex = ref(null)

const usersMenuItems = ref([
	// { label: 'View Users', path: '/admin/users/view' },
	// { label: 'Add User', path: '/admin/users/add' }
])

const sidebarItems = ref([
	{ label: 'Dashboard', path: '/admin/' },
	{
		label: 'Products',
		path: '/admin/products',
		iconPath:
			'M12 2C8.14 2 5 5.14 5 9V17.59L2.7 19.9C2.53 20.05 2.39 20.28 2.35 20.54C2.31 20.79 2.37 21.05 2.5 21.27L12 22L21.5 21.27C21.63 21.05 21.69 20.79 21.65 20.54C21.61 20.28 21.47 20.05 21.3 19.9L19 17.59V9C19 5.14 15.86 2 12 2Z',
	},
	{
		label: 'Orders',
		path: '/admin/orders',
		iconPath: 'M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z',
	},
	{ label: 'Settings', path: '/admin/settings' },
	{ label: 'Cards', path: '/admin/cards' },
])

function toggleUsersMenu() {
	isUsersMenuOpen.value = !isUsersMenuOpen.value
}

function toggleMobileUsersMenu() {
	isMobileUsersMenuOpen.value = !isMobileUsersMenuOpen.value
}

function isActive(path) {
	const route = useRoute()
	return route.path === path
}

watch(themeStore.getData(), (newVal, oldVal) => {
	console.log('Theme changed from', oldVal, 'to', newVal)
})
</script>

<style scoped>
.active {
	border-radius: 0.5rem;
}

.dark {
	color: #ffffff;
}

.light {
	color: #000000;
}
</style>

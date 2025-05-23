<template>
	<aside :class="['z-20 flex-shrink-0 hidden w-64 overflow-y-auto md:block', themeStore.theme]">
		<div :class="['py-4 text-gray-500', themeStore.theme]">
			<div class="py-2 px-8">
				<h1 class="items-center text-xl text-bold justify-center">{{ role }} Dashboard</h1>
			</div>
			<ul class="mt-6">
				<li class="relative px-6 py-3" v-for="(item, index) in filteredSidebarItems" :key="index">
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
							v-if="item.iconPath"
						>
							<path :d="item.iconPath" />
						</svg>
						<span class="ml-4">{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
		</div>
	</aside>
</template>

<script setup>
import { useNavStore } from '~/stores/navStore'
import { useThemeStore } from '~/stores/themeStore'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const route = useRoute()
const navStore = useNavStore()
const themeStore = useThemeStore()

const { role, user, token } = storeToRefs(useAuthStore())

const isUsersMenuOpen = ref(false)
const isMobileUsersMenuOpen = ref(false)
const activeIndex = ref(null)

const allSidebarItems = {
	ADMIN: [
		{
			label: 'Dashboard',
			path: '/admin/',
			iconPath:
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		},
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
		{
			label: 'Settings',
			path: '/admin/settings',
			iconPath:
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
		},
		{
			label: 'Cards',
			path: '/admin/cards',
			iconPath: 'M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z',
		},
	],
	VENDOR: [
		{
			label: 'Dashboard',
			path: '/vendor/',
			iconPath:
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
		},
		{
			label: 'Products',
			path: '/vendor/products',
			iconPath:
				'M12 2C8.14 2 5 5.14 5 9V17.59L2.7 19.9C2.53 20.05 2.39 20.28 2.35 20.54C2.31 20.79 2.37 21.05 2.5 21.27L12 22L21.5 21.27C21.63 21.05 21.69 20.79 21.65 20.54C21.61 20.28 21.47 20.05 21.3 19.9L19 17.59V9C19 5.14 15.86 2 12 2Z',
		},
		{
			label: 'Orders',
			path: '/vendor/orders',
			iconPath: 'M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h16v2H4v-2zm0 5h16v2H4v-2z',
		},
		{
			label: 'Employees',
			path: '/vendor/employees',
			iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
		},
	],
}

const usersMenuItems = ref([])

const filteredSidebarItems = computed(() => {
	return allSidebarItems[role.value] || []
})

function toggleUsersMenu() {
	isUsersMenuOpen.value = !isUsersMenuOpen.value
}

function toggleMobileUsersMenu() {
	isMobileUsersMenuOpen.value = !isMobileUsersMenuOpen.value
}

function isActive(path) {
	return route.path === path
}

watch(themeStore.getData(), (newVal, oldVal) => {})
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

<template>
	<client-only>
		<v-navigation-drawer
			v-model="isSidebarOpen"
			:permanent="isDesktop"
			:temporary="!isDesktop"
			class="z-20 flex-shrink-0 w-64 overflow-y-auto bg-gray-800 md:block shadow-md"
			style="background-color: rgb(var(--color-sidebar)); color: rgb(var(--color-sidebar-text))"
		>
			<div class="py-4">
				<div class="py-2 px-8">
					<h1 class="items-center text-xl text-bold justify-center" style="color: rgb(var(--color-sidebar-text))">{{ role }}</h1>
				</div>
				<v-list nav>
					<v-list-item
						v-for="(item, index) in filteredSidebarItems"
						:key="index"
						:to="item.path"
						:prepend-icon="item.icon"
						:title="item.label"
						class="button"
						:class="{
							'v-list-item--active': isActive(item.path),
						}"
					>
					</v-list-item>
				</v-list>
			</div>
		</v-navigation-drawer>
		<template #placeholder>
			<div class="w-64"></div>
		</template>
	</client-only>
</template>

<script setup>
import { useNavStore } from '~/stores/navStore'
import { useAuthStore } from '~/stores/auth'
import { useDisplay } from 'vuetify'
import { storeToRefs } from 'pinia'
import { computed } from 'vue';

const route = useRoute()
const navStore = useNavStore()
const { role } = storeToRefs(useAuthStore())
const { mdAndUp: isDesktop } = useDisplay()

const isSidebarOpen = computed({
  get: () => isDesktop.value ? navStore.isDesktopSidebarOpen : navStore.isMobileSidebarOpen,
  set: (value) => {
    if (isDesktop.value) {
      navStore.isDesktopSidebarOpen = value
    } else {
      navStore.isMobileSidebarOpen = value
    }
  },
});

const allSidebarItems = {
	ADMIN: [
		{
			label: 'Dashboard',
			path: '/admin/',
			icon: 'mdi-view-dashboard',
		},
		{
			label: 'Users',
			path: '/admin/users',
			icon: 'mdi-account-group-outline',
		},
		{
			label: 'Businesses',
			path: '/admin/businesses',
			icon: 'mdi-store-outline',
		},
		{
			label: 'Inventory',
			path: '/admin/inventory',
			icon: 'mdi-clipboard-text-play-outline',
		},
		{
			label: 'Products',
			path: '/admin/products',
			icon: 'mdi-package-variant-closed',
		},
		{
			label: 'Orders',
			path: '/admin/orders',
			icon: 'mdi-cart-outline',
		},
		{
			label: 'Categories',
			path: '/admin/categories',
			icon: 'mdi-tag-multiple-outline',
		},
		{
			label: 'Coupons',
			path: '/admin/coupons',
			icon: 'mdi-ticket-percent-outline',
		},
		{
			label: 'Reviews',
			path: '/admin/reviews',
			icon: 'mdi-star-outline',
		},
		{
			label: 'Settings',
			path: '/admin/settings',
			icon: 'mdi-cog-outline',
		},
	],
	BUSINESS_OWNER: [
		{
			label: 'Dashboard',
			path: '/business/',
			icon: 'mdi-view-dashboard',
		},
		{
			label: 'Inventory',
			path: '/business/inventory',
			icon: 'mdi-store-outline',
		},
		{
			label: 'Products',
			path: '/business/products',
			icon: 'mdi-package-variant-closed',
		},
		{
			label: 'Orders',
			path: '/business/orders',
			icon: 'mdi-cart-outline',
		},
		{
			label: 'Employees',
			path: '/business/employees',
			icon: 'mdi-account-group-outline',
		},
		{
			label: 'Shipping Zones',
			path: '/business/shipping',
			icon: 'mdi-truck-fast-outline',
		},
		{
			label: 'Tax Config',
			path: '/business/tax',
			icon: 'mdi-percent-outline',
		},
	],
	BUSINESS_MEMBER: [
		{
			label: 'Dashboard',
			path: '/business/',
			icon: 'mdi-view-dashboard',
		},
		{
			label: 'Products',
			path: '/business/products',
			icon: 'mdi-package-variant-closed',
		},
		{
			label: 'Inventory',
			path: '/business/inventory',
			icon: 'mdi-store-outline',
		},
		{
			label: 'Orders',
			path: '/business/orders',
			icon: 'mdi-cart-outline',
		},
		{
			label: 'Employees',
			path: '/business/employees',
			icon: 'mdi-account-group-outline',
		},
	],
}

const filteredSidebarItems = computed(() => {
	return allSidebarItems[role.value] || []
})

function isActive(path) {
	if (path === route.path) {
		return true
	}
	// If path is a base path and doesn't end with a slash, check if the current route is a sub-path.
	if (!path.endsWith('/') && route.path.startsWith(path + '/')) {
		return true
	}
	return false
}
</script>

<style scoped>
.v-list-item--active {
	background-color: rgb(var(--color-primary));
	color: white;
}
</style>
